// ============================================================================
// LEADERBOARD COMPONENT - Live ranking display with real-time updates
// ============================================================================
// Features:
// - Real-time leaderboard updates
// - Top 10 participants display
// - Special styling for top 3 positions
// - User name resolution from WebSocket users list
// - Responsive design with smooth animations
// ============================================================================

"use client";

import { LeaderboardProps } from "@/types/globaltypes";

export default function Leaderboard({ leaderboard, users }: LeaderboardProps) {
    // Sort leaderboard entries by score (highest first) and limit to top 10
    const sortedLeaderboard = Object.entries(leaderboard)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    // Helper function to get user name from userId
    const getUserName = (userId: string) => {
        const user = users.find(u => u.userId === userId);
        return user?.name || `User ${userId.slice(0, 8)}`;
    };

    // Get rank-specific styling
    const getRankStyling = (index: number) => {
        switch (index) {
            case 0: // 1st place
                return {
                    background: "bg-gradient-to-r from-yellow-50 to-yellow-100",
                    border: "border-yellow-200",
                    badge: "bg-yellow-500 text-white",
                    icon: "👑"
                };
            case 1: // 2nd place
                return {
                    background: "bg-gradient-to-r from-gray-50 to-gray-100",
                    border: "border-gray-200",
                    badge: "bg-gray-400 text-white",
                    icon: "🥈"
                };
            case 2: // 3rd place
                return {
                    background: "bg-gradient-to-r from-orange-50 to-orange-100",
                    border: "border-orange-200",
                    badge: "bg-orange-500 text-white",
                    icon: "🥉"
                };
            default: // Other positions
                return {
                    background: "bg-gray-50",
                    border: "border-gray-100",
                    badge: "bg-gray-200 text-gray-700",
                    icon: "🏃‍♂️"
                };
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="text-2xl mr-3">🏆</span>
                    Live Leaderboard
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Top {Math.min(sortedLeaderboard.length, 10)} participants
                </p>
            </div>

            {/* Leaderboard Entries */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedLeaderboard.map(([userId, score], index) => {
                    const styling = getRankStyling(index);

                    return (
                        <div
                            key={userId}
                            className={`${styling.background} ${styling.border} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
                        >
                            <div className="flex items-center justify-between">
                                {/* Left side - Rank and User */}
                                <div className="flex items-center flex-1 min-w-0">
                                    {/* Rank Badge */}
                                    <div className={`${styling.badge} w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0`}>
                                        {index + 1}
                                    </div>

                                    {/* Rank Icon */}
                                    <span className="text-lg mr-2 flex-shrink-0">
                                        {styling.icon}
                                    </span>

                                    {/* User Name */}
                                    <div className="min-w-0 flex-1">
                                        <span className="font-semibold text-gray-800 truncate block">
                                            {getUserName(userId)}
                                        </span>
                                        {index < 3 && (
                                            <span className="text-xs text-gray-600">
                                                {index === 0 ? "Champion!" : index === 1 ? "Runner-up!" : "Bronze!"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Right side - Score */}
                                <div className="text-right ml-3">
                                    <div className="text-lg font-bold text-blue-600">
                                        {score}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        points
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {sortedLeaderboard.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎯</div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        No scores yet!
                    </h4>
                    <p className="text-gray-500 text-sm">
                        Be the first to answer and claim the top spot!
                    </p>
                </div>
            )}

            {/* Footer Stats */}
            {sortedLeaderboard.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>{users.length} total participants</span>
                        <span>Updates live</span>
                    </div>
                </div>
            )}
        </div>
    );
}
