import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ icon, title, value, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 text-primary",
    success: "from-success/20 to-accent/5 text-success",
    warning: "from-warning/20 to-yellow-100 text-warning",
    error: "from-error/20 to-red-100 text-error",
    info: "from-info/20 to-blue-100 text-info"
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.12)" }}
      className="bg-white rounded-xl p-6 shadow-card transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend === "up" ? "text-success" : "text-error"}`}>
            <ApperIcon name={trend === "up" ? "TrendingUp" : "TrendingDown"} size={16} />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;