import { useEffect, useState } from "react";
import { getMyExamResults, getMyExamStatistics, type ExamResultItem, type ExamStatistics } from "../../apis/Student.api";

const StatCard = ({ title, value, suffix = "" }: { title: string; value: number; suffix?: string }) => (
	<div className="card bg-base-200">
		<div className="card-body p-4">
			<p className="text-sm opacity-70">{title}</p>
			<p className="text-2xl font-bold">{value}{suffix}</p>
		</div>
	</div>
);

const Bar = ({ label, count, max }: { label: string; count: number; max: number }) => {
	const pct = max > 0 ? Math.round((count / max) * 100) : 0;
	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between text-xs">
				<span>{label}</span>
				<span>{count}</span>
			</div>
			<div className="h-2 bg-base-200 rounded">
				<div className="h-2 bg-primary rounded" style={{ width: `${pct}%` }} />
			</div>
		</div>
	);
};

export default function ExamStatistics() {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<ExamStatistics | null>(null);
	const [results, setResults] = useState<ExamResultItem[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const [s, r] = await Promise.all([getMyExamStatistics(), getMyExamResults()]);
				setStats(s);
				setResults(r);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading) return <div className="p-4">Loading...</div>;

	return (
		<div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto max-h-screen">
			<h2 className="text-2xl font-bold">Exam overview</h2>

			{stats && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<StatCard title="Total exams" value={stats.total_exams} />
					<StatCard title="Average score" value={Math.round(stats.average_score)} suffix="/100" />
					<StatCard title="Accuracy" value={Math.round(stats.accuracy_rate)} suffix="%" />
					<StatCard title="Questions" value={stats.total_questions} />
				</div>
			)}

			{stats && stats.score_distribution && (
				<div className="card bg-base-100">
					<div className="card-body">
						<h3 className="card-title text-lg">Score distribution</h3>
						<div className="space-y-3">
							<Bar label="Excellent (>=90)" count={stats.score_distribution.excellent || 0} max={Math.max(1, stats.total_exams)} />
							<Bar label="Good (80-89)" count={stats.score_distribution.good || 0} max={Math.max(1, stats.total_exams)} />
							<Bar label="Average (70-79)" count={stats.score_distribution.average || 0} max={Math.max(1, stats.total_exams)} />
							<Bar label="Below (<70)" count={stats.score_distribution.below_average || 0} max={Math.max(1, stats.total_exams)} />
						</div>
					</div>
				</div>
			)}

			<div className="card bg-base-100">
				<div className="card-body">
					<h3 className="card-title text-lg">Recent results</h3>
					<div className="overflow-x-auto">
						<table className="table table-sm">
							<thead>
								<tr>
									<th>Exam</th>
									<th>Course</th>
									<th>Score</th>
									<th>Correct</th>
									<th>Wrong</th>
								</tr>
							</thead>
							<tbody>
								{results.map(r => (
									<tr key={r._id}>
										<td>{r.exam_id?.name}</td>
										<td>{r.course_id?.name || "-"}</td>
										<td>{r.score}</td>
										<td>{r.correct_answers}</td>
										<td>{r.wrong_answers}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
