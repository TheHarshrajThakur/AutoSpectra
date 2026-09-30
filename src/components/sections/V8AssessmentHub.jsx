import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Printer,
  ChevronRight,
  Sparkles,
  Sliders,
  Check,
  Zap,
  ShieldCheck,
  HelpCircle,
  GraduationCap
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  V8_TIERS,
  V8_QUESTIONS,
  V8_RANKS,
  getQuestionsByTier,
  getRandomExamQuestions,
  getRankForScore
} from '../../data/v8AssessmentData'

export default function V8AssessmentHub({ onBackToModules }) {
  const { t } = useTranslation()

  // Navigation states: 'select' | 'quiz' | 'results' | 'review' | 'certificate'
  const [viewState, setViewState] = useState('select')
  const [assessmentMode, setAssessmentMode] = useState('tiered') // 'tiered' | 'exam'
  const [selectedTierId, setSelectedTierId] = useState('tier-1')
  
  // Active questions set
  const [activeQuestions, setActiveQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { [questionId]: selectedOptionIndex }
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false) // For tiered practice instant feedback

  // Exam timer
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef(null)

  // Certificate student name & serial
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('autospectra_student_name') || 'Chief Powertrain Specialist'
  })
  const [certificateSerial, setCertificateSerial] = useState('')
  const [reviewFilter, setReviewFilter] = useState('all') // 'all' | 'incorrect' | 'correct'

  // Load completed tier history
  const [tierRecords, setTierRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('autospectra_v8_tier_records')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Timer tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isTimerRunning])

  // Save student name
  const handleStudentNameChange = (val) => {
    setStudentName(val)
    try {
      localStorage.setItem('autospectra_student_name', val)
    } catch (e) {
      console.error(e)
    }
  }

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  // Start Practice Tier
  const startTierQuiz = (tierId) => {
    const qs = getQuestionsByTier(tierId)
    setSelectedTierId(tierId)
    setAssessmentMode('tiered')
    setActiveQuestions(qs)
    setCurrentIndex(0)
    setUserAnswers({})
    setIsAnswerSubmitted(false)
    setTimerSeconds(0)
    setIsTimerRunning(true)
    setViewState('quiz')
    window.scrollTo({ top: 120, behavior: 'smooth' })
  }

  // Start Comprehensive Exam
  const startComprehensiveExam = (questionCount = 15) => {
    const qs = getRandomExamQuestions(questionCount)
    setAssessmentMode('exam')
    setActiveQuestions(qs)
    setCurrentIndex(0)
    setUserAnswers({})
    setIsAnswerSubmitted(false)
    setTimerSeconds(0)
    setIsTimerRunning(true)
    setViewState('quiz')
    window.scrollTo({ top: 120, behavior: 'smooth' })
  }

  // Current Question
  const currentQ = activeQuestions[currentIndex] || null

  // Handle Option Select
  const handleSelectOption = (optionIndex) => {
    if (assessmentMode === 'tiered' && isAnswerSubmitted) {
      return // Already submitted for this question in tiered practice
    }
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }))
  }

  // Submit Answer in Tiered Mode (reveals explanation)
  const handleSubmitPracticeAnswer = () => {
    if (userAnswers[currentQ.id] !== undefined) {
      setIsAnswerSubmitted(true)
    }
  }

  // Next Question
  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(i => i + 1)
      setIsAnswerSubmitted(false)
    } else {
      finishAssessment()
    }
  }

  // Prev Question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
      setIsAnswerSubmitted(assessmentMode === 'tiered' && userAnswers[activeQuestions[currentIndex - 1]?.id] !== undefined)
    }
  }

  // Finish and compute scores
  const finishAssessment = () => {
    setIsTimerRunning(false)
    // Generate cert serial
    const randomHex = Math.floor(100000 + Math.random() * 900000)
    setCertificateSerial(`AS-V8-${new Date().getFullYear()}-${randomHex}`)

    // Record tier progress if in tiered mode
    if (assessmentMode === 'tiered' && selectedTierId) {
      const correctCount = activeQuestions.filter(q => userAnswers[q.id] === q.answerIndex).length
      const pct = Math.round((correctCount / activeQuestions.length) * 100)
      const updated = {
        ...tierRecords,
        [selectedTierId]: {
          score: pct,
          date: new Date().toLocaleDateString(),
          passed: pct >= 70
        }
      }
      setTierRecords(updated)
      try {
        localStorage.setItem('autospectra_v8_tier_records', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
    }

    setViewState('results')
    window.scrollTo({ top: 120, behavior: 'smooth' })
  }

  // Calculation for Results
  const { totalScore, correctCount, percentage, rankDetails, tierBreakdown } = useMemo(() => {
    if (!activeQuestions.length) {
      return { totalScore: 0, correctCount: 0, percentage: 0, rankDetails: V8_RANKS[V8_RANKS.length - 1], tierBreakdown: {} }
    }

    let correct = 0
    const breakdown = {}

    V8_TIERS.forEach(t => {
      breakdown[t.id] = { total: 0, correct: 0, title: t.title, color: t.color }
    })

    activeQuestions.forEach(q => {
      if (!breakdown[q.tierId]) {
        breakdown[q.tierId] = { total: 0, correct: 0, title: 'Other', color: '#3b82f6' }
      }
      breakdown[q.tierId].total += 1
      if (userAnswers[q.id] === q.answerIndex) {
        correct += 1
        breakdown[q.tierId].correct += 1
      }
    })

    const pct = Math.round((correct / activeQuestions.length) * 100)
    const rank = getRankForScore(pct)

    return {
      totalScore: activeQuestions.length,
      correctCount: correct,
      percentage: pct,
      rankDetails: rank,
      tierBreakdown: breakdown
    }
  }, [activeQuestions, userAnswers])

  // Filtered review list
  const filteredReviewQuestions = useMemo(() => {
    if (reviewFilter === 'correct') {
      return activeQuestions.filter(q => userAnswers[q.id] === q.answerIndex)
    }
    if (reviewFilter === 'incorrect') {
      return activeQuestions.filter(q => userAnswers[q.id] !== q.answerIndex)
    }
    return activeQuestions
  }, [activeQuestions, userAnswers, reviewFilter])

  return (
    <div className="v8-assessment-hub" data-lenis-prevent="true" style={{ width: '100%', color: '#fff' }}>
      {/* View: SELECT MODULE / EXAM */}
      {viewState === 'select' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hero Header Banner */}
          <div
            style={{
              padding: '2.5rem 2rem',
              borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(10,15,30,0.85) 100%)',
              border: '1px solid rgba(59,130,246,0.25)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
              marginBottom: '2.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-40%',
                right: '-10%',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', borderRadius: '9999px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                <ShieldCheck size={14} /> Powertrain Technical Assessment
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: '0 0 1rem 0', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                V8 Engine Builder <span style={{ background: 'linear-gradient(90deg, #38bdf8, #3b82f6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Certification</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', maxWidth: '750px', lineHeight: 1.6, margin: 0 }}>
                Test your theoretical knowledge and hands-on mechanical precision across 5 comprehensive tiers: from fundamental bore/stroke geometry and 90° cross-plane harmonics, to precision bearing clearances and forced induction calibration.
              </p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setAssessmentMode('tiered')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem',
                background: assessmentMode === 'tiered' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                border: assessmentMode === 'tiered' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                color: assessmentMode === 'tiered' ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
            >
              <BookOpen size={18} color={assessmentMode === 'tiered' ? '#3b82f6' : 'currentColor'} />
              <span>Tiered Practice Quizzes (Basics to Advanced)</span>
            </button>

            <button
              onClick={() => setAssessmentMode('exam')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem',
                background: assessmentMode === 'exam' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.03)',
                border: assessmentMode === 'exam' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                color: assessmentMode === 'exam' ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
            >
              <Award size={18} color={assessmentMode === 'exam' ? '#ef4444' : 'currentColor'} />
              <span>Master Builder Exam (Timed Certification)</span>
            </button>
          </div>

          {/* Content: Mode A - Tiered Grid */}
          {assessmentMode === 'tiered' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {V8_TIERS.map((tier) => {
                  const record = tierRecords[tier.id]
                  const qCount = getQuestionsByTier(tier.id).length
                  return (
                    <motion.div
                      key={tier.id}
                      whileHover={{ y: -4, borderColor: tier.color, boxShadow: `0 15px 30px -10px ${tier.color}33` }}
                      style={{
                        padding: '1.75rem',
                        borderRadius: '1.25rem',
                        background: 'rgba(20,24,35,0.65)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onClick={() => startTierQuiz(tier.id)}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '0.5rem',
                              background: `${tier.color}22`,
                              color: tier.color,
                              border: `1px solid ${tier.color}44`
                            }}
                          >
                            Tier {tier.tierNumber} • {tier.level}
                          </span>
                          {record && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: record.passed ? '#10b981' : '#f59e0b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              {record.passed ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                              {record.score}%
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                          {tier.title}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                          {tier.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                          {qCount} Rigorous Questions
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: tier.color, fontWeight: 700, fontSize: '0.85rem' }}>
                          <span>Start Tier</span>
                          <ArrowRight size={15} />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Content: Mode B - Master Certification Exam Banner */}
          {assessmentMode === 'exam' && (
            <div
              style={{
                padding: '2rem 1.25rem',
                borderRadius: '1.5rem',
                background: 'rgba(20,20,30,0.8)',
                border: '1px solid rgba(239,68,68,0.3)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ maxWidth: '750px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.8rem', borderRadius: '9999px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                  <Award size={16} /> Standard SAE / ASE Engine Blueprinting Exam Format
                </div>

                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: '0 0 1rem 0' }}>
                  Grand Master V8 Engine Builder Examination
                </h2>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  This standardized exam draws 15 comprehensive questions spanning all 5 engineering tiers without instant answer disclosure. Upon submission, your composite score determines your formal Engineering Rank and generates your verifiable <strong style={{ color: '#60a5fa' }}>Certificate of Competence</strong>.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Total Questions</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginTop: '0.25rem' }}>15 Items</div>
                  </div>
                  <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Pass Threshold</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', marginTop: '0.25rem' }}>75% (Grade A)</div>
                  </div>
                  <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Certificate</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#60a5fa', marginTop: '0.25rem' }}>Verifiable ID</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => startComprehensiveExam(15)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '1rem 2rem',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 10px 25px rgba(239,68,68,0.4)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <span>Begin 15-Question Certification Exam</span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={() => startComprehensiveExam(20)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '1rem 1.75rem',
                      borderRadius: '0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Take Full 20-Question Exam</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* View: ACTIVE QUIZ / EXAM */}
      {viewState === 'quiz' && currentQ && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          style={{ maxWidth: '900px', margin: '0 auto' }}
        >
          {/* Top Bar: Back, Mode Badge, Timer, Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => {
                if (window.confirm('Leave current assessment? Your current progress will be lost.')) {
                  setIsTimerRunning(false)
                  setViewState('select')
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={15} /> Exit to Hub
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700 }}>
                <Clock size={14} />
                <span>Elapsed: {formatTime(timerSeconds)}</span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
                Question {currentIndex + 1} of {activeQuestions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '2rem' }}>
            <div
              style={{
                width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          {/* Question Card */}
          <div
            style={{
              padding: '2.5rem',
              borderRadius: '1.5rem',
              background: 'rgba(18,22,32,0.8)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              marginBottom: '2rem'
            }}
          >
            {/* Metadata Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '0.4rem',
                  background: 'rgba(59,130,246,0.15)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59,130,246,0.3)'
                }}
              >
                {currentQ.topic}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '0.4rem',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.6)'
                }}
              >
                Level: {currentQ.difficulty}
              </span>
            </div>

            {/* Question Text */}
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {currentQ.question}
            </h2>

            {/* Formula Callout Box (if provided) */}
            {currentQ.formula && (
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(10,15,25,0.7)',
                  borderLeft: '3px solid #38bdf8',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Engineering Formula:
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#e0f2fe', fontWeight: 700 }}>
                  {currentQ.formula}
                </div>
              </div>
            )}

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentQ.options.map((optionText, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx
                const isCorrect = optIdx === currentQ.answerIndex
                const showFeedback = assessmentMode === 'tiered' && isAnswerSubmitted

                let bg = 'rgba(255,255,255,0.02)'
                let borderColor = 'rgba(255,255,255,0.08)'
                let textColor = 'rgba(255,255,255,0.85)'

                if (showFeedback) {
                  if (isCorrect) {
                    bg = 'rgba(16,185,129,0.15)'
                    borderColor = '#10b981'
                    textColor = '#fff'
                  } else if (isSelected && !isCorrect) {
                    bg = 'rgba(239,68,68,0.15)'
                    borderColor = '#ef4444'
                    textColor = '#fff'
                  }
                } else if (isSelected) {
                  bg = 'rgba(59,130,246,0.15)'
                  borderColor = '#3b82f6'
                  textColor = '#fff'
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={showFeedback}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1.15rem 1.25rem',
                      borderRadius: '0.75rem',
                      background: bg,
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      textAlign: 'left',
                      cursor: showFeedback ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '0.98rem',
                      lineHeight: 1.5
                    }}
                  >
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: `1px solid ${borderColor}`,
                        background: isSelected ? (showFeedback ? (isCorrect ? '#10b981' : '#ef4444') : '#3b82f6') : 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span style={{ flexGrow: 1 }}>{optionText}</span>
                    {showFeedback && isCorrect && <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />}
                    {showFeedback && isSelected && !isCorrect && <XCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                  </button>
                )
              })}
            </div>

            {/* In Tiered Mode: Instant Explanation on Submit */}
            {assessmentMode === 'tiered' && isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderLeft: '4px solid #3b82f6'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <HelpCircle size={16} /> Engineering Technical Rationale:
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: currentIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {assessmentMode === 'tiered' && !isAnswerSubmitted ? (
              <button
                onClick={handleSubmitPracticeAnswer}
                disabled={userAnswers[currentQ.id] === undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  background: userAnswers[currentQ.id] === undefined ? 'rgba(59,130,246,0.3)' : '#3b82f6',
                  border: 'none',
                  color: '#fff',
                  cursor: userAnswers[currentQ.id] === undefined ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: userAnswers[currentQ.id] !== undefined ? '0 0 15px rgba(59,130,246,0.4)' : 'none'
                }}
              >
                <span>Check Answer</span>
                <Check size={16} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={userAnswers[currentQ.id] === undefined && assessmentMode === 'tiered'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  background: currentIndex === activeQuestions.length - 1 ? '#10b981' : '#3b82f6',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: currentIndex === activeQuestions.length - 1 ? '0 0 20px rgba(16,185,129,0.4)' : '0 0 15px rgba(59,130,246,0.4)'
                }}
              >
                <span>{currentIndex === activeQuestions.length - 1 ? 'Complete Assessment' : 'Next Question'}</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {/* Quick Jump Dot Matrix */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {activeQuestions.map((q, idx) => {
              const isAns = userAnswers[q.id] !== undefined
              const isCurr = idx === currentIndex
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx)
                    setIsAnswerSubmitted(assessmentMode === 'tiered' && userAnswers[q.id] !== undefined)
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '0.4rem',
                    background: isCurr ? '#3b82f6' : isAns ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
                    border: isCurr ? '1px solid #60a5fa' : isAns ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    color: isCurr ? '#fff' : isAns ? '#93c5fd' : 'rgba(255,255,255,0.4)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* View: RESULTS BREAKDOWN */}
      {viewState === 'results' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ maxWidth: '950px', margin: '0 auto' }}
        >
          {/* Main Scorecard Header */}
          <div
            style={{
              padding: '3rem 2.5rem',
              borderRadius: '1.5rem',
              background: 'radial-gradient(ellipse at top, rgba(30,58,138,0.4) 0%, rgba(15,23,42,0.85) 100%)',
              border: `1px solid ${rankDetails.badgeColor}66`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.7), 0 0 30px ${rankDetails.badgeColor}22`,
              marginBottom: '2.5rem',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: `${rankDetails.badgeColor}22`, border: `1px solid ${rankDetails.badgeColor}`, color: rankDetails.titleColor, fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
              <Award size={16} /> Official Grade: {rankDetails.grade}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: '0 0 0.5rem 0', color: rankDetails.titleColor }}>
              {rankDetails.rank}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              {rankDetails.summary}
            </p>

            {/* Big Score Numbers */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                  {percentage}%
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, marginTop: '0.4rem' }}>
                  Composite Score
                </div>
              </div>

              <div style={{ height: '60px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

              <div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#10b981', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                  {correctCount} / {totalScore}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, marginTop: '0.4rem' }}>
                  Validated Answers
                </div>
              </div>

              <div style={{ height: '60px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

              <div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#38bdf8', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                  {formatTime(timerSeconds)}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, marginTop: '0.4rem' }}>
                  Completion Time
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button
              onClick={() => setViewState('certificate')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.9rem 1.75rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                border: 'none',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(37,99,235,0.4)'
              }}
            >
              <Award size={18} /> View Official Certificate
            </button>

            <button
              onClick={() => setViewState('review')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.9rem 1.75rem',
                borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <BookOpen size={18} /> Review All Technical Explanations
            </button>

            <button
              onClick={() => setViewState('select')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.9rem 1.5rem',
                borderRadius: '0.75rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} /> Return to Hub
            </button>
          </div>

          {/* Domain Breakdown by Tier */}
          <div style={{ padding: '2rem', borderRadius: '1.25rem', background: 'rgba(20,24,35,0.65)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Discipline Proficiency Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {Object.entries(tierBreakdown).map(([tierId, stat]) => {
                if (stat.total === 0) return null
                const tierPct = Math.round((stat.correct / stat.total) * 100)
                return (
                  <div key={tierId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: stat.color }}>{stat.title}</span>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                        {stat.correct} / {stat.total} ({tierPct}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${tierPct}%`,
                          height: '100%',
                          background: stat.color,
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* View: OFFICIAL CERTIFICATE */}
      {viewState === 'certificate' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ maxWidth: '950px', margin: '0 auto' }}
        >
          {/* Certificate Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }} className="cert-toolbar">
            <button
              onClick={() => setViewState('results')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Scorecard
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Recipient Name:</span>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => handleStudentNameChange(e.target.value)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                  placeholder="Enter your name"
                />
              </div>

              <button
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '0.5rem',
                  background: '#10b981',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
                }}
              >
                <Printer size={16} /> Print / Save PDF
              </button>
            </div>
          </div>

          {/* Printable Certificate Canvas */}
          <div
            id="autospectra-certificate-card"
            style={{
              padding: '4rem 3.5rem',
              borderRadius: '1.5rem',
              background: 'linear-gradient(145deg, #090d16 0%, #05070d 100%)',
              border: '2px solid rgba(59,130,246,0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), inset 0 0 80px rgba(59,130,246,0.05)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center'
            }}
          >
            {/* Ornamental Border Line */}
            <div
              style={{
                position: 'absolute',
                inset: '16px',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '1.25rem',
                pointerEvents: 'none'
              }}
            />

            {/* Seal / Header */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}>
                <Award size={24} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>
                AUTOSPECTRA POWERTRAIN ACADEMY
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#60a5fa', marginBottom: '0.75rem' }}>
              Certificate of Mechanical Competence
            </div>

            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: '0 0 1.5rem 0', color: '#fff' }}>
              V8 Engine Architecture & Calibration
            </h2>

            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              This official document certifies that the undersigned engineering candidate has successfully demonstrated professional technical competency across engine geometry, dynamic balancing, valvetrain mechanics, and blueprinting tolerances:
            </p>

            {/* Recipient Name Display */}
            <div style={{ margin: '2rem 0' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#38bdf8', letterSpacing: '-0.01em', textDecoration: 'underline', textDecorationColor: 'rgba(56,189,248,0.3)', textUnderlineOffset: '8px' }}>
                {studentName || 'Powertrain Engineer'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>
                Verified Candidate
              </div>
            </div>

            {/* Rank Stamp */}
            <div
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                borderRadius: '0.75rem',
                background: `${rankDetails.badgeColor}18`,
                border: `1px solid ${rankDetails.badgeColor}`,
                color: rankDetails.titleColor,
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '3rem'
              }}
            >
              {rankDetails.rank} ({rankDetails.grade})
            </div>

            {/* Credentials / Signatures Footer */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Verification Serial</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: '#fff', fontWeight: 700, marginTop: '0.25rem' }}>{certificateSerial || 'AS-V8-2026-CONFIRMED'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Conferred Date</div>
                <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700, marginTop: '0.25rem' }}>{new Date().toLocaleDateString()}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Academic Director</div>
                <div style={{ fontFamily: "'Dancing Script', cursive, serif", fontSize: '1.3rem', color: '#60a5fa', marginTop: '0.1rem' }}>AutoSpectra Labs</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* View: COMPREHENSIVE ANSWER REVIEW */}
      {viewState === 'review' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ maxWidth: '950px', margin: '0 auto' }}
        >
          {/* Header & Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => setViewState('results')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Scorecard
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setReviewFilter('all')}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '0.5rem',
                  background: reviewFilter === 'all' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                All ({activeQuestions.length})
              </button>
              <button
                onClick={() => setReviewFilter('incorrect')}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '0.5rem',
                  background: reviewFilter === 'incorrect' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Incorrect ({activeQuestions.filter(q => userAnswers[q.id] !== q.answerIndex).length})
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '0.5rem',
                  background: reviewFilter === 'correct' ? '#10b981' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Correct ({activeQuestions.filter(q => userAnswers[q.id] === q.answerIndex).length})
              </button>
            </div>
          </div>

          {/* Question List with Explanations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredReviewQuestions.map((q, idx) => {
              const userOpt = userAnswers[q.id]
              const isCorrect = userOpt === q.answerIndex
              return (
                <div
                  key={q.id}
                  style={{
                    padding: '2rem',
                    borderRadius: '1.25rem',
                    background: 'rgba(18,22,32,0.85)',
                    border: isCorrect ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '0.35rem', background: isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: isCorrect ? '#34d399' : '#f87171' }}>
                        {isCorrect ? 'Correct' : 'Needs Review'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                        {q.topic} • {q.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                    {idx + 1}. {q.question}
                  </h3>

                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.answerIndex
                      const isOptionSelected = oIdx === userOpt

                      let bg = 'rgba(255,255,255,0.02)'
                      let bdr = 'rgba(255,255,255,0.06)'
                      let col = 'rgba(255,255,255,0.7)'

                      if (isOptionCorrect) {
                        bg = 'rgba(16,185,129,0.12)'
                        bdr = 'rgba(16,185,129,0.4)'
                        col = '#34d399'
                      } else if (isOptionSelected) {
                        bg = 'rgba(239,68,68,0.12)'
                        bdr = 'rgba(239,68,68,0.4)'
                        col = '#f87171'
                      }

                      return (
                        <div
                          key={oIdx}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            background: bg,
                            border: `1px solid ${bdr}`,
                            color: col,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {isOptionCorrect && <CheckCircle2 size={16} color="#10b981" />}
                          {isOptionSelected && !isOptionCorrect && <XCircle size={16} color="#ef4444" />}
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation Callout */}
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '0.75rem',
                      background: 'rgba(15,23,42,0.8)',
                      borderLeft: '3px solid #38bdf8'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Engineering Mechanics Breakdown:
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #autospectra-certificate-card, #autospectra-certificate-card * {
            visibility: visible;
          }
          #autospectra-certificate-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #05070d !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .cert-toolbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
