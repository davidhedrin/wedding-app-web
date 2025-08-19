"use client";

export default function SignUp({ setSigninSignup }: { setSigninSignup: React.Dispatch<React.SetStateAction<number>> }) {
  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-2xs">
      <div className="text-center">
        <div className="block text-xl font-bold text-gray-800">Sign-Up</div>
        <p className="mt-1 text-sm text-gray-600">
          Already have an account? <span onClick={() => setSigninSignup(1)} className="cursor-pointer text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium">
            Sign In
          </span> here.
        </p>
      </div></div>
  )
}
