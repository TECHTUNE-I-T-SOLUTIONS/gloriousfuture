"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenText,
  Check,
  CircleAlert,
  Facebook,
  GraduationCap,
  Heart,
  Link2,
  LoaderCircle,
  MessageCircle,
  MessageSquareText,
  PenLine,
  SearchX,
  Send,
} from "lucide-react";

import CustomHeader from "@/components/CustomHeader";
import CustomFooter from "@/components/CustomFooter";
import PageHero from "@/components/public/PageHero";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_role: "teacher" | "pupil";
  image_url?: string | null;
  likes_count?: number;
  comments_count?: number;
}

type CommentType = { id: string; author_name: string; content: string };

const shareTooltipClass =
  "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-brand-ink px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [postLink, setPostLink] = useState<string>("");
  const [likeStatus, setLikeStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    fetch(`/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push("/blog");
        } else {
          setBlog(data);
          setLikes(data.likes_count ?? 0);
          setComments([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    setPostLink(`${window.location.origin}/blog/${params.id}`);
    fetch(`/api/blogs/${params.id}/comments`)
      .then((r) => r.json())
      .then((cdata) => setComments(cdata || []))
      .catch((err) => {
        console.error("fetch comments err", err);
      });
  }, [params?.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-brand-surface">
        <CustomHeader />
        <main className="flex-1">
          <PageHero
            kicker="School news"
            title="Opening the story"
            description="We are fetching this update from the GFA newsroom."
            icon={BookOpenText}
          />
          <section className="gfa-section">
            <div className="gfa-container">
              <div
                role="status"
                aria-live="polite"
                className="gfa-card mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-16 text-center"
              >
                <LoaderCircle className="h-9 w-9 animate-spin text-brand-indigo" aria-hidden="true" />
                <h2 className="font-display text-2xl text-brand-ink">Loading story…</h2>
                <p className="max-w-md text-sm leading-relaxed text-brand-ink/70">
                  Please wait while we prepare the full article.
                </p>
              </div>
            </div>
          </section>
        </main>
        <CustomFooter />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col bg-brand-surface">
        <CustomHeader />
        <main className="flex-1">
          <PageHero
            kicker="School news"
            title="Story not found"
            description="This link may have changed, or the story may no longer be available."
            icon={SearchX}
          />
          <section className="gfa-section">
            <div className="gfa-container">
              <div
                role="alert"
                className="gfa-card mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-16 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <CircleAlert className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 className="font-display text-2xl text-brand-ink">We couldn’t find that story</h2>
                <p className="max-w-md text-sm leading-relaxed text-brand-ink/70">
                  Head back to the news page to read the latest updates from our school community.
                </p>
                <Link href="/blog" className="gfa-btn gfa-btn-primary mt-2">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to news
                </Link>
              </div>
            </div>
          </section>
        </main>
        <CustomFooter />
      </div>
    );
  }

  const authorRole = blog.author_role === "teacher" ? "Staff writer" : "Student writer";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(postLink)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`;

  const handleLike = async () => {
    setLiked((s) => !s);
    setLikes((l) => (liked ? Math.max(0, l - 1) : l + 1));
    setLikeStatus("");
    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`/api/blogs/${blog.id}/like`, { method });
      const js = await res.json();
      if (!res.ok) throw new Error(js?.error || "like failed");
      setLikes(js.likes_count ?? likes);
    } catch (err) {
      console.error("like error", err);
      setLiked((s) => !s);
      setLikes((l) => (liked ? l + 1 : Math.max(0, l - 1)));
      setLikeStatus("We couldn’t update your like. Please try again.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postLink);
      setCopied(true);
      setCopyStatus("Story link copied to clipboard.");
    } catch {
      setCopyStatus("We couldn’t copy the link. Please copy it from the address bar.");
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const temp = { id: "temp-" + Date.now(), author_name: "You", content: commentText };
    setComments((s) => [temp, ...s]);
    const body = { content: commentText };
    setCommentText("");
    try {
      const res = await fetch(`/api/blogs/${blog.id}/comments`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js?.error || "comment failed");
      setComments((s) => [js, ...s.filter((x) => x.id && !x.id.toString().startsWith("temp-"))]);
    } catch (err) {
      console.error("comment post error", err);
      setComments((s) => s.filter((x) => !x.id.toString().startsWith("temp-")));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface">
      <CustomHeader />

      <main className="flex-1">
        <article>
          <PageHero
            kicker={authorRole}
            title={blog.title}
            description={`A story from our school community, shared by ${blog.author_name}.`}
            icon={BookOpenText}
          >
            <Link href="/blog" className="gfa-btn gfa-btn-secondary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to news
            </Link>
            <span className="gfa-chip">
              <GraduationCap className="h-4 w-4 text-brand-gold" aria-hidden="true" />
              GFA newsroom
            </span>
          </PageHero>

          <section className="gfa-section" aria-label="Story content">
            <div className="gfa-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="min-w-0 space-y-8">
                {blog.image_url && (
                  <figure className="gfa-card overflow-hidden">
                    <div className="relative aspect-[16/9] w-full bg-brand-mist">
                      <Image
                        src={blog.image_url || "/placeholder.svg"}
                        alt={`Image accompanying “${blog.title}”`}
                        fill
                        priority
                        sizes="(min-width: 1024px) 70vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="sr-only">Image accompanying {blog.title}</figcaption>
                  </figure>
                )}

                <div className="gfa-card p-6 sm:p-8 lg:p-10">
                  <p className="gfa-eyebrow">
                    <BookOpenText className="h-4 w-4" aria-hidden="true" />
                    From the newsroom
                  </p>
                  <div
                    className="mt-5 max-w-none break-words text-base leading-8 text-brand-ink/80 [&_a]:font-semibold [&_a]:text-brand-indigo [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-brand-ink [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-brand-ink [&_img]:my-6 [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>

                <div className="gfa-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-xl text-brand-ink">Enjoyed this story?</h2>
                    <p className="mt-1 text-sm text-brand-ink/65">
                      Show {blog.author_name} some appreciation with a like.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={liked}
                    onClick={handleLike}
                    className={`inline-flex min-h-[2.9rem] items-center justify-center gap-2 self-start rounded-xl px-5 py-3 text-sm font-semibold transition-colors sm:self-auto ${
                      liked
                        ? "bg-brand-indigo text-white"
                        : "border border-brand-line bg-white text-brand-ink hover:border-brand-indigo hover:bg-brand-mist"
                    }`}
                  >
                    <Heart
                      className="h-4 w-4"
                      fill={liked ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                    {liked ? "Liked" : "Like"} ({likes})
                  </button>
                </div>
                {likeStatus && (
                  <p role="alert" className="text-sm font-semibold text-red-700">
                    {likeStatus}
                  </p>
                )}

                <section
                  aria-labelledby="comments-heading"
                  className="gfa-card p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line pb-5">
                    <h2
                      id="comments-heading"
                      className="flex items-center gap-2 font-display text-2xl text-brand-ink"
                    >
                      <MessageSquareText className="h-5 w-5 text-brand-gold" aria-hidden="true" />
                      Comments
                    </h2>
                    <p role="status" aria-live="polite" className="gfa-chip">
                      {comments.length} {comments.length === 1 ? "comment" : "comments"}
                    </p>
                  </div>

                  {comments.length === 0 ? (
                    <p role="status" className="py-8 text-center text-sm text-brand-ink/65">
                      No comments yet. Start the conversation below.
                    </p>
                  ) : (
                    <ul className="space-y-4 py-6">
                      {comments.map((c) => (
                        <li
                          key={c.id}
                          className="rounded-xl border border-brand-line bg-brand-surface p-4"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-indigo text-xs font-bold text-white"
                            >
                              {c.author_name.charAt(0).toUpperCase()}
                            </span>
                            <p className="text-sm font-semibold text-brand-ink">{c.author_name}</p>
                          </div>
                          <p className="mt-2 break-words pl-11 text-sm leading-relaxed text-brand-ink/75">
                            {c.content}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="space-y-3 border-t border-brand-line pt-6">
                    <label htmlFor="comment-input" className="gfa-label flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                      Add a comment
                    </label>
                    <textarea
                      id="comment-input"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="gfa-input min-h-[6rem] resize-y"
                      rows={3}
                      placeholder="Share a thoughtful response with the school community…"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleComment}
                        disabled={!commentText.trim()}
                        className="gfa-btn gfa-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Post comment
                      </button>
                    </div>
                  </div>
                </section>

                <section
                  aria-labelledby="share-heading"
                  className="gfa-card p-6 sm:p-8"
                >
                  <h2 id="share-heading" className="font-display text-2xl text-brand-ink">
                    Share this story
                  </h2>
                  <p className="mt-2 text-sm text-brand-ink/65">
                    Pass it on to a classmate, family member or colleague.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                    <div className="group relative">
                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copy the link to this story"
                        title="Copy post link"
                        className="gfa-btn gfa-btn-secondary"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-brand-indigo" aria-hidden="true" />
                        ) : (
                          <Link2 className="h-4 w-4" aria-hidden="true" />
                        )}
                        Copy link
                      </button>
                      <span aria-hidden="true" className={shareTooltipClass}>
                        Copy post link
                      </span>
                    </div>

                    <div className="group relative">
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share this story on WhatsApp"
                        title="Share on WhatsApp"
                        className="gfa-btn gfa-btn-secondary"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        WhatsApp
                      </a>
                      <span aria-hidden="true" className={shareTooltipClass}>
                        Share on WhatsApp
                      </span>
                    </div>

                    <div className="group relative">
                      <a
                        href={facebookHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share this story on Facebook"
                        title="Share on Facebook"
                        className="gfa-btn gfa-btn-secondary"
                      >
                        <Facebook className="h-4 w-4" aria-hidden="true" />
                        Facebook
                      </a>
                      <span aria-hidden="true" className={shareTooltipClass}>
                        Share on Facebook
                      </span>
                    </div>
                  </div>
                  {copyStatus && (
                    <p role="status" aria-live="polite" className="mt-4 text-sm text-brand-ink/70">
                      {copyStatus}
                    </p>
                  )}
                </section>
              </div>

              <aside className="space-y-6" aria-label="Story details">
                <div className="gfa-card p-6">
                  <p className="gfa-eyebrow">Story details</p>
                  <dl className="mt-5 space-y-4 text-sm">
                    <div>
                      <dt className="text-brand-ink/55">Writer</dt>
                      <dd className="mt-1 font-semibold text-brand-ink">{blog.author_name}</dd>
                    </div>
                    <div>
                      <dt className="text-brand-ink/55">Community</dt>
                      <dd className="mt-1 font-semibold text-brand-ink">{authorRole}</dd>
                    </div>
                    <div>
                      <dt className="text-brand-ink/55">Appreciations</dt>
                      <dd className="mt-1 font-semibold text-brand-ink">{likes}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-[1.25rem] bg-brand-ink p-6 text-white">
                  <GraduationCap className="h-7 w-7 text-brand-gold" aria-hidden="true" />
                  <h2 className="mt-4 font-display text-xl">Keep learning with us</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Try a practice quiz and see how much you have learned.
                  </p>
                  <Link
                    href="/quizzes"
                    className="gfa-btn gfa-btn-primary mt-5 !border-brand-gold !bg-brand-gold !text-brand-ink"
                  >
                    Browse quizzes
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </aside>
            </div>
          </section>
        </article>
      </main>

      <CustomFooter />
    </div>
  );
}
