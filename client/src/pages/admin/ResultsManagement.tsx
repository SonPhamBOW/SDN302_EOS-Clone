import { useEffect, useState } from "react";
import { adminArchiveExamResults, adminExportExamResults, adminListExamResults, type AdminExamResult } from "../../apis/Admin.api";

export default function ResultsManagement() {
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState<AdminExamResult[]>([]);
	const [archived, setArchived] = useState<boolean | undefined>(undefined);
	const [selected, setSelected] = useState<Record<string, boolean>>({});

	async function load() {
		setLoading(true);
		try {
			const data = await adminListExamResults({ archived });
			setResults(data);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => { load(); }, [archived]);

	async function onExport() {
		try {
			console.log("Exporting with filter:", { archived });
			const blob = await adminExportExamResults({ archived });
			console.log("Export successful, blob size:", blob.size);
			
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "exam-results.xlsx";
			a.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Export failed:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			alert("Export failed: " + errorMessage);
		}
	}

	async function onArchive(flag: boolean) {
		const ids = Object.keys(selected).filter(id => selected[id]);
		if (ids.length === 0) return;
		await adminArchiveExamResults({ resultIds: ids, archived: flag });
		setSelected({});
		await load();
	}

	if (loading) return <div className="p-4">Loading...</div>;

	// Debug info
	console.log("Results:", results);
	console.log("Archived filter:", archived);

	return (
		<div className="p-4 sm:p-6 lg:p-8 space-y-4 overflow-auto max-h-screen">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Results management</h2>
				<div className="flex gap-2">
					<select className="select select-sm select-bordered" value={archived === undefined ? "all" : archived ? "archived" : "active"} onChange={(e) => {
						const v = e.target.value;
						setArchived(v === "all" ? undefined : v === "archived");
					}}>
						<option value="all">All</option>
						<option value="active">Active</option>
						<option value="archived">Archived</option>
					</select>
					<button className="btn btn-outline btn-sm" onClick={onExport}>Export Excel</button>
					<button className="btn btn-sm" onClick={() => onArchive(true)} disabled={!Object.values(selected).some(Boolean)}>Archive</button>
					<button className="btn btn-sm btn-secondary" onClick={() => onArchive(false)} disabled={!Object.values(selected).some(Boolean)}>Unarchive</button>
				</div>
			</div>

			<div className="overflow-x-auto">
				{results.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-lg text-gray-500">No exam results found.</p>
						<p className="text-sm text-gray-400 mt-2">
							{archived === undefined ? "No results available" : 
							 archived ? "No archived results" : "No active results"}
						</p>
					</div>
				) : (
					<table className="table table-sm">
						<thead>
							<tr>
								<th></th>
								<th>Student</th>
								<th>Email</th>
								<th>Course</th>
								<th>Exam</th>
								<th>Score</th>
								<th>Correct/Wrong</th>
								<th>Total</th>
								<th>Archived</th>
							</tr>
						</thead>
						<tbody>
							{results.map(r => (
								<tr key={r._id}>
									<td>
										<input type="checkbox" className="checkbox checkbox-sm" checked={!!selected[r._id]} onChange={e => setSelected(s => ({ ...s, [r._id]: e.target.checked }))} />
									</td>
									<td>{r.student_id?.name}</td>
									<td className="text-xs opacity-70">{r.student_id?.email}</td>
									<td>{r.course_id?.name}</td>
									<td>{r.exam_id?.name}</td>
									<td>{r.score}</td>
									<td>{r.correct_answers}/{r.wrong_answers}</td>
									<td>{r.total_questions}</td>
									<td>{r.archived ? "Yes" : "No"}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
