"use client";

import { useState, useTransition } from "react";
import { deleteListingAction } from "@/app/_actions/listings";

interface Props {
  id: string;
  title: string;
}

export default function DeleteListingButton({ id, title }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteListingAction(id);
      if (result.error) setError(result.error);
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Delete chalet
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-red-700">
        Are you sure you want to permanently delete <strong>{title}</strong>?
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "Deleting…" : "Yes, delete permanently"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="h-9 rounded-lg border border-sand-200 px-4 text-sm font-medium text-warm-700 transition hover:bg-sand-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
