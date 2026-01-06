export const BRANCH_COLORS = [
    "#ef402f", // Core Red
    "#f59e0b", // Amber/Yellow
    "#10b981", // Emerald/Green
    "#3b82f6", // Blue
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#f97316", // Orange
];

// Gradient pairs for enhanced visual effects
export const BRANCH_GRADIENTS = [
    ["#ef402f", "#E63A35"],
    ["#ef3a2f", "#f14f2f"],
    ["#F3692F", "#ef402f"],
    ["#E63A35", "#dc2626"],
    ["#f14f2f", "#F3692F"],
    ["#ef402f", "#ef3a2f"],
    ["#dc2626", "#991b1b"],
    ["#f87171", "#ef402f"],
];

// Helper function to darken a color for gradients
export function darkenColor(color: string, percent: number = 20): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
        "#" +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
            .toString(16)
            .slice(1)
    );
}
