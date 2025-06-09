import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Clock,
  Zap,
  Target,
  Award,
  Activity
} from "lucide-react";
import ContentGenerationForm from "../components/ContentCard";
import { useAgents } from "../context/AgentContext";

const Dashboard: React.FC = () => {
  const { agents, activeWorkflows, completedItems } = useAgents();

  const kpiCards = [
    {
      title: "Active Workflows",
      value: activeWorkflows,
      subtitle: "Content in progress",
      icon: <Activity className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      change: "+12%"
    },
    {
      title: "Completed Content",
      value: completedItems,
      subtitle: "Published items",
      icon: <FileText className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      change: "+8%"
    },
    {
      title: "Active Agents",
      value: agents.filter(agent => agent.status === 'active').length,
      subtitle: "Currently processing",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      change: "+5%"
    },
    {
      title: "Success Rate",
      value: "94%",
      subtitle: "Workflow completion",
      icon: <Award className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      change: "+2%"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-8"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            AI Content Studio Dashboard
          </h2>
          <p className="text-gray-600">
            Multi-Agent Content Generation Platform
          </p>
        </div>
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              System Online
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
      >
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            className="card relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${kpi.color} rounded-xl text-white shadow-lg`}>
                  {kpi.icon}
                </div>
                <motion.span 
                  className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {kpi.change}
                </motion.span>
              </div>
              
              <h4 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h4>
              <motion.p 
                className="text-2xl font-bold text-gray-800 mb-1"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              >
                {kpi.value}
              </motion.p>
              <p className="text-xs text-gray-500">{kpi.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Generation Section */}
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Generate New Content</h3>
        </div>
        <ContentGenerationForm />
      </motion.div>

      {/* Agent Network Status */}
      <motion.div 
        className="card"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Agent Network Status</h3>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className="p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-all duration-300 group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{agent.name}</h4>
                  <motion.span 
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      agent.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      agent.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      agent.status === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {agent.status}
                  </motion.span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-gray-800">{agent.tasksCompleted}</p>
                    <p className="text-gray-500 text-xs">Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800">{(agent.successRate * 100).toFixed(0)}%</p>
                    <p className="text-gray-500 text-xs">Success</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800">{agent.avgCompletionTime}min</p>
                    <p className="text-gray-500 text-xs">Avg Time</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.successRate * 100}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;