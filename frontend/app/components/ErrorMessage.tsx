interface ErrorMessageProps {
  message: string | null | undefined;
}

/** Renders a form-level error banner, or nothing when there is no message. */
export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  );
}
