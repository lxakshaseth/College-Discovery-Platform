"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MessageSquare, Plus, ThumbsUp, Send, User, Building2, Search, CheckCircle2, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnswerItem {
  id: string;
  content: string;
  upvotes: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface QuestionItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  collegeId: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  college?: {
    id: string;
    name: string;
    slug: string;
    location: string;
  } | null;
  answers: AnswerItem[];
}

export default function DiscussionsPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("ALL");
  const [collegesList, setCollegesList] = useState<Array<{ id: string; name: string }>>([]);

  // Ask Question Form state
  const [showAskForm, setShowAskForm] = useState(false);
  const [askTitle, setAskTitle] = useState("");
  const [askContent, setAskContent] = useState("");
  const [askCollegeId, setAskCollegeId] = useState("GENERAL");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [questionError, setQuestionError] = useState("");

  // Answer submitting state mapped by question ID
  const [activeAnswerBox, setActiveAnswerBox] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Upvoted answers tracking
  const [upvotedAnswers, setUpvotedAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchQuestions();
    fetchColleges();
  }, [selectedCollege]);

  async function fetchColleges() {
    try {
      const res = await fetch("/api/colleges?limit=50");
      if (res.ok) {
        const json = await res.json();
        setCollegesList(json.data.map((c: any) => ({ id: c.id, name: c.name })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchQuestions() {
    setLoading(true);
    try {
      const url = selectedCollege && selectedCollege !== "ALL"
        ? `/api/questions?collegeId=${selectedCollege}`
        : "/api/questions";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      alert("Please log in to post a question.");
      return;
    }

    if (!askTitle.trim() || !askContent.trim()) {
      setQuestionError("Please fill out both title and details.");
      return;
    }

    setSubmittingQuestion(true);
    setQuestionError("");

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: askTitle,
          content: askContent,
          collegeId: askCollegeId === "GENERAL" ? null : askCollegeId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit question");
      }

      const newQ = await res.json();
      setQuestions([newQ, ...questions]);
      setAskTitle("");
      setAskContent("");
      setAskCollegeId("GENERAL");
      setShowAskForm(false);
    } catch (err: any) {
      setQuestionError(err.message || "Failed to post question.");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handlePostAnswer = async (questionId: string) => {
    if (!session?.user) {
      alert("Please log in to submit an answer.");
      return;
    }

    if (!answerContent.trim()) return;

    setSubmittingAnswer(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent }),
      });

      if (res.ok) {
        const newAns = await res.json();
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId ? { ...q, answers: [newAns, ...q.answers] } : q
          )
        );
        setAnswerContent("");
        setActiveAnswerBox(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleUpvote = async (questionId: string, answerId: string) => {
    if (!session?.user) {
      alert("Please log in to upvote answers.");
      return;
    }

    if (upvotedAnswers[answerId]) return;

    try {
      const res = await fetch(`/api/questions/${questionId}/answers/${answerId}/vote`, {
        method: "POST",
      });

      if (res.ok) {
        setUpvotedAnswers((prev) => ({ ...prev, [answerId]: true }));
        setQuestions((prev) =>
          prev.map((q) => {
            if (q.id !== questionId) return q;
            return {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
              ),
            };
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    return (
      q.title.toLowerCase().includes(term) ||
      q.content.toLowerCase().includes(term) ||
      q.college?.name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-2 border border-blue-200">
            <MessageSquare className="h-3.5 w-3.5" />
            Student Community & Aspirant Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            College Q&A & Admissions Forum
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ask doubts regarding cutoffs, hostel life, placements, and syllabus directly to senior students.
          </p>
        </div>

        <Button
          onClick={() => setShowAskForm(!showAskForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          {showAskForm ? "Close Form" : "Ask a Question"}
        </Button>
      </div>

      {/* Ask Question Card */}
      {showAskForm && (
        <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Post Your Admission or College Query
            </h3>
            <span className="text-xs text-slate-400">Community answers within 24h</span>
          </div>

          {session?.user ? (
            <form onSubmit={handleCreateQuestion} className="space-y-4">
              {questionError && (
                <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-200">
                  {questionError}
                </div>
              )}

              <div>
                <Label className="text-xs font-bold text-slate-700 mb-1 block">Question Headline</Label>
                <Input
                  placeholder="e.g. What is the safe JEE Main rank for CSE at NIT Trichy in 2026?"
                  value={askTitle}
                  onChange={(e) => setAskTitle(e.target.value)}
                  maxLength={150}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-slate-700 mb-1 block">Tag College (Optional)</Label>
                  <Select value={askCollegeId} onValueChange={setAskCollegeId}>
                    <SelectTrigger className="w-full text-xs">
                      <SelectValue placeholder="Select relevant institute" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL">General / Any College</SelectItem>
                      {collegesList.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 mb-1 block">Detailed Explanation</Label>
                <Textarea
                  placeholder="Add details about your rank, category, branch preference, or specific doubts..."
                  value={askContent}
                  onChange={(e) => setAskContent(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAskForm(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingQuestion}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
                >
                  {submittingQuestion ? "Posting..." : "Publish Question"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl bg-blue-50/60 p-5 text-center border border-blue-100 space-y-3">
              <p className="text-sm text-slate-700 font-medium">
                Log in to post questions and engage with students & alumni.
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/login">
                  <Button size="sm" className="bg-blue-600 text-white font-semibold">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="outline" className="font-semibold">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search questions by keyword or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="w-full sm:w-64">
          <Select value={selectedCollege} onValueChange={setSelectedCollege}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="All Colleges" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Colleges</SelectItem>
              {collegesList.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions Feed */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium">Loading community discussions...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <MessageCircle className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No discussions found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first to start a conversation about this college or admission topic!
          </p>
          <Button
            size="sm"
            onClick={() => setShowAskForm(true)}
            className="bg-blue-600 text-white font-semibold mt-2"
          >
            Ask the First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-blue-200 transition"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {q.college ? (
                      <Link href={`/colleges/${q.college.slug}`}>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold gap-1 text-xs hover:bg-blue-100">
                          <Building2 className="h-3 w-3" />
                          {q.college.name}
                        </Badge>
                      </Link>
                    ) : (
                      <Badge variant="secondary" className="text-xs font-semibold">
                        General Admissions
                      </Badge>
                    )}
                    <span className="text-[11px] text-slate-400">
                      Asked by <span className="font-semibold text-slate-600">{q.user.name || "Student"}</span> •{" "}
                      {new Date(q.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {q.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 self-start">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {q.answers.length} {q.answers.length === 1 ? "Answer" : "Answers"}
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">{q.content}</p>

              {/* Answers Section */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Answers ({q.answers.length})
                  </h4>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveAnswerBox(activeAnswerBox === q.id ? null : q.id)}
                    className="text-xs text-blue-600 hover:bg-blue-50 gap-1 h-7"
                  >
                    <Send className="h-3 w-3" />
                    Write Answer
                  </Button>
                </div>

                {/* Reply Form */}
                {activeAnswerBox === q.id && (
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                    <Label className="text-xs font-bold text-slate-700">Your Answer / Experience</Label>
                    <Textarea
                      placeholder="Provide helpful context, branch statistics, hostel insights..."
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveAnswerBox(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={submittingAnswer || !answerContent.trim()}
                        onClick={() => handlePostAnswer(q.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                      >
                        {submittingAnswer ? "Submitting..." : "Submit Answer"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Answer list */}
                {q.answers.map((ans) => (
                  <div key={ans.id} className="rounded-xl bg-slate-50/70 p-4 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                          {ans.user.name?.[0] || "U"}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{ans.user.name || "Senior Student"}</span>
                        <Badge variant="success" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-medium gap-0.5">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                        </Badge>
                      </div>

                      <button
                        onClick={() => handleUpvote(q.id, ans.id)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold transition ${
                          upvotedAnswers[ans.id]
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                        title="Upvote helpful answer"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{ans.upvotes}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{ans.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
