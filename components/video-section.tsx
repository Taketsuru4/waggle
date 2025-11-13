export function VideoSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Μάθε περισσότερα για το Waggle
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Δες το βίντεο για να καταλάβεις πώς λειτουργεί η πλατφόρμα μας
        </p>
      </div>

      <div className="mt-8">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 shadow-lg">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            controls
            preload="metadata"
          >
            <source src="/assets/waggle-intro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Example YouTube embed (commented out - uncomment and add video ID when ready) */}
          {/* <iframe
            className="absolute inset-0 h-full w-full"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Waggle Introduction Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          /> */}
        </div>
      </div>
    </section>
  );
}
