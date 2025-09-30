import { motion } from "framer-motion";

const Loading = ({ type = "card" }) => {
  if (type === "table") {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite"
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="h-4 w-24 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse mb-3" />
            <div className="h-8 w-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded animate-pulse mb-2" />
            <div className="h-3 w-20 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="h-5 w-3/4 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;