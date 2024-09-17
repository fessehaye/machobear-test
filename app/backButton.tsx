import { useNavigate } from "@remix-run/react";
export default function BackButton() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <button onClick={goBack} className="flex gap-2 hover:text-green-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
      {"Back"}
    </button>
  );
}
