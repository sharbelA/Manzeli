import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export default function ChaletDetailLoading() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="mt-4">
          <Container>
            {/* Gallery skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 rounded-2xl overflow-hidden h-72 md:h-[440px]">
              <div className="bg-[var(--surface)] animate-pulse" />
              <div className="hidden md:grid grid-rows-2 gap-2">
                <div className="bg-[var(--surface)] animate-pulse" />
                <div className="bg-[var(--surface)] animate-pulse" />
              </div>
            </div>
          </Container>
        </div>

        <Container>
          <div className="mt-8 flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="flex-1 space-y-6">
              {/* Title skeleton */}
              <div className="space-y-3">
                <div className="h-8 bg-[var(--surface)] rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 bg-[var(--surface)] rounded w-1/2 animate-pulse" />
              </div>
              <hr className="border-[var(--border-light)]" />
              {/* Host skeleton */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--surface)] animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-[var(--surface)] rounded w-32 animate-pulse" />
                  <div className="h-3 bg-[var(--surface)] rounded w-48 animate-pulse" />
                </div>
              </div>
              <hr className="border-[var(--border-light)]" />
              {/* Description skeleton */}
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-[var(--surface)] rounded animate-pulse"
                    style={{ width: `${85 - i * 10}%` }}
                  />
                ))}
              </div>
            </div>
            {/* Booking card skeleton */}
            <div className="hidden lg:block w-[360px] shrink-0">
              <div className="h-96 bg-[var(--surface)] rounded-2xl animate-pulse" />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
