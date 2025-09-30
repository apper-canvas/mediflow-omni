import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "FileX", 
  title = "No data found", 
  description = "Get started by adding your first item",
  action,
  actionLabel = "Add New"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-center mb-8 max-w-md">{description}</p>
      {action && (
        <Button onClick={action} variant="primary" size="lg">
          <ApperIcon name="Plus" size={20} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;