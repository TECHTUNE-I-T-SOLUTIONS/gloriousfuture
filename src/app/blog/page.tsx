"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, CircleAlert, LoaderCircle, Newspaper, NotebookPen } from "lucide-react";

import CustomHeader from "@/components/CustomHeader";
import CustomFooter from "@/components/CustomFooter";
import PageHero from "@/components/public/PageHero";
import SectionHeading from "@/components/public/SectionHeading";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_role: "teacher" | "pupil";
  image_url?: string | null;
}

function toExcerpt(content: string, wordLimit = 42) {
  const text = (() => {
    const value = content ?? "";
    if (typeof window === "undefined") {
      return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
    const parsed = new DOMParser().parseFromString(value, "text/html");
    return (parsed.body.textContent ?? "").replace(/\s+/g, " ").trim();
  })();

  if (!text) return "Open this story to read the full update.";

  const words = text.split(" ").filter(Boolean);
  return words.length > wordLimit ? `${words.slice(0, wordLimit).join(" ")}…` : text;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data || []);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("We could not load the latest stories. Please refresh the page and try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const countLabel = loading
    ? "Loading stories"
    : `${blogs.length} ${blogs.length === 1 ? "story" : "stories"}`;

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface">
      <CustomHeader />

      <main className="flex-1">
        <PageHero
          kicker="School news"
          title="Stories from our school"
          description="Announcements, classroom moments and achievements from the Glorious Future Academy community in Oro."
          icon={Newspaper}
        >
          <span className="gfa-chip">
            <BookOpenText className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            Written by students and staff
          </span>
        </PageHero>

        <section className="gfa-section" aria-labelledby="latest-stories-heading">
          <div className="gfa-container">
            <div id="latest-stories-heading">
              <SectionHeading
                title="Latest stories"
                description="A closer look at life, learning and achievement across our campus."
                action={
                  <p role="status" aria-live="polite" className="gfa-chip self-start">
                    {countLabel}
                  </p>
                }
              />
            </div>

            {loading ? (
              <div role="status" aria-live="polite" className="space-y-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-ink/70">
                  <LoaderCircle className="h-4 w-4 animate-spin text-brand-indigo" aria-hidden="true" />
                  Loading stories…
                </p>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="gfa-card h-80 animate-pulse overflow-hidden">
                      <div className="h-40 bg-brand-mist" />
                      <div className="space-y-3 p-6">
                        <div className="h-4 w-1/3 rounded bg-brand-mist" />
                        <div className="h-5 w-4/5 rounded bg-brand-mist" />
                        <div className="h-3 w-full rounded bg-brand-mist" />
                        <div className="h-3 w-2/3 rounded bg-brand-mist" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div
                role="alert"
                className="gfa-card mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-14 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <CircleAlert className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="font-display text-2xl text-brand-ink">Stories are unavailable</h3>
                <p className="max-w-md text-sm leading-relaxed text-brand-ink/70">{error}</p>
              </div>
            ) : blogs.length === 0 ? (
              <div
                role="status"
                aria-live="polite"
                className="gfa-card mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-mist text-brand-indigo">
                  <NotebookPen className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="font-display text-2xl text-brand-ink">No stories published yet</h3>
                <p className="max-w-md text-sm leading-relaxed text-brand-ink/70">
                  Our newsroom is preparing its first update. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full rounded-[1.25rem] focus-visible:outline-offset-4"
                  >
                    <article className="gfa-card flex h-full flex-col overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
                      {blog.image_url ? (
                        <div className="relative h-44 w-full overflow-hidden bg-brand-mist">
                          <Image
                            src={blog.image_url}
                            alt={`Image accompanying “${blog.title}”`}
                            fill
                            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="h-1 w-full bg-brand-gold/70" aria-hidden="true" />
                      )}

                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-brand-ink/60">
                          <span className="gfa-chip !py-1">
                            {blog.author_role === "teacher" ? "Staff writer" : "Student writer"}
                          </span>
                          <span className="truncate">{blog.author_name}</span>
                        </div>

                        <h3 className="mt-4 line-clamp-2 font-display text-2xl leading-snug text-brand-ink transition-colors group-hover:text-brand-indigo">
                          {blog.title}
                        </h3>

                        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-brand-ink/70">
                          {toExcerpt(blog.content)}
                        </p>

                        <div className="mt-auto flex items-center justify-between gap-3 border-t border-brand-line pt-5 text-sm font-semibold text-brand-indigo">
                          <span>Read full story</span>
                          <ArrowUpRight
                            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <CustomFooter />
    </div>
  );
}
