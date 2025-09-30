import React, { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick }) => {
  const { logout } = useContext(AuthContext);
  return (
    <motion.header
    initial={{
        y: -20,
        opacity: 0
    }}
    animate={{
        y: 0,
        opacity: 1
    }}
    className="bg-white border-b border-slate-200 sticky top-0 z-40">
    <div className="px-6 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMenuClick}
                    className="lg:hidden !p-2">
                    <ApperIcon name="Menu" size={24} />
                </Button>
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                        <ApperIcon name="Heart" className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">MediFlow</h1>
                        <p className="text-xs text-slate-600">Hospital Management</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="!p-2 relative">
                    <ApperIcon name="Bell" size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                </Button>
                <div
                    className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">Dr. Admin</p>
                        <p className="text-xs text-slate-600">Administrator</p>
                    </div>
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="text-primary" size={20} />
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="!p-2"
                    title="Logout">
                    <ApperIcon name="LogOut" size={20} />
                </Button>
            </div>
        </div>
    </div>
</motion.header>
  );
};

export default Header;