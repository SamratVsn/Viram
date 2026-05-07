import { motion } from "framer-motion";
import { RiArrowLeftLine, RiHammerLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1];

export default function ViramBuildingPage() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{
        backgroundColor: "#F4EEE3",
        color: "#2A2218",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      {/* Grain Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease }}
        className="relative w-full max-w-xl overflow-hidden rounded-[28px] border p-10 md:p-14"
        style={{
          backgroundColor: "#F9F5EC",
          borderColor: "rgba(55,38,22,0.07)",
          boxShadow:
            "0px 10px 30px rgba(44,32,20,0.05), inset 0px 1px 0px rgba(255,255,255,0.4)",
        }}
      >
        {/* Card Grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-[18px]"
            style={{
              backgroundColor: "#EFE5D6",
              color: "#5A4E42",
            }}
          >
            <RiHammerLine size={24} />
          </div>

          <h1
            className="text-5xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
            }}
          >
            Under Construction
          </h1>

          <p
            className="mt-4 max-w-md text-sm leading-7"
            style={{ color: "#5A4E42" }}
          >
            The Viram dashboard is currently being carefully crafted.
          </p>

          <div className="mt-10 flex items-center gap-4">
            {/* Back Button */}
            <motion.div
              whileHover={{
                y: -2,
                boxShadow: "0px 8px 18px rgba(44,32,20,0.08)",
              }}
              transition={{ duration: 0.4, ease }}
            >
              <Link
                to="/"
                className="flex items-center gap-2 rounded-[18px] border px-5 py-3 text-sm tracking-wide transition-all"
                style={{
                  borderColor: "rgba(55,38,22,0.07)",
                  backgroundColor: "rgba(255,255,255,0.45)",
                  color: "#5A4E42",
                }}
              >
                <RiArrowLeftLine size={18} />
                Back Home
              </Link>
            </motion.div>

            {/* Primary Button */}
            <motion.button
              whileHover={{
                y: -2,
                boxShadow: "0px 10px 20px rgba(184,112,78,0.15)",
              }}
              transition={{ duration: 0.4, ease }}
              className="rounded-[18px] px-6 py-3 text-sm tracking-wide"
              style={{
                backgroundColor: "#B8704E",
                color: "#F9F5EC",
              }}
            >
              Coming Soon
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}