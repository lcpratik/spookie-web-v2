export default function LoadingSkeleton({ count = 6 }) {
    return (
        <div className="cards-container">
            {Array.from({ length: count }).map((_, index) => (
                <div className="skeleton-card" key={index}>
                    <div className="skeleton-line photo" />
                    <div className="skeleton-line title" />
                    <div className="skeleton-line short" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                </div>
            ))}
        </div>
    )
}
