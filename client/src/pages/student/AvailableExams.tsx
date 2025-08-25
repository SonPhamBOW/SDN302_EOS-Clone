import { useEffect, useState } from "react";
import { getAvailableExams, type AvailableExam } from "../../apis/Student.api";
import { Link } from "react-router";

export default function AvailableExams() {
	const [loading, setLoading] = useState(true);
	const [exams, setExams] = useState<AvailableExam[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchExams = async () => {
		setLoading(true);
		try {
			// Kiểm tra nếu searchTerm có thể là course code (chứa toàn chữ và số, độ dài 3-10 ký tự)
			const isCourseCode = /^[A-Z0-9]{3,10}$/.test(searchTerm.toUpperCase());
			const courseCode = isCourseCode ? searchTerm.toUpperCase() : undefined;
			const generalSearch = isCourseCode ? undefined : searchTerm;
			
			const data = await getAvailableExams(generalSearch, courseCode);
			setExams(data);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchExams();
	}, []);

	const handleSearch = () => {
		fetchExams();
	};

	const handleClear = () => {
		setSearchTerm("");
		fetchExams();
	};

	if (loading) return <div className="p-4">Loading...</div>;

	return (
		<div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto max-h-screen">
			<h2 className="text-2xl font-bold">Available exams</h2>
			
			{/* Search Section */}
			<div className="card bg-base-100 shadow-sm">
				<div className="card-body">
					<h3 className="card-title text-lg">Search Exams</h3>
					<div className="flex gap-4">
						<div className="form-control flex-1">
							<label className="label">
								<span className="label-text">Search by exam name, course name, or course code (e.g., MLN111)</span>
							</label>
							<input
								type="text"
								placeholder="Enter exam name, course name, or course code..."
								className="input input-bordered"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">&nbsp;</span>
							</label>
							<div className="flex gap-2">
								<button onClick={handleSearch} className="btn btn-primary">
									Search
								</button>
								<button onClick={handleClear} className="btn btn-outline">
									Clear
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Results Section */}
			<div className="grid gap-4 md:grid-cols-2">
				{exams.map((e) => (
					<div key={e._id} className={`card ${e.canAccess ? 'bg-base-100' : 'bg-base-200 opacity-60'}`}>
						<div className="card-body">
							<div className="flex items-center justify-between">
								<h3 className="card-title">{e.name}</h3>
								<span className={`badge ${
									e.status === 'ongoing' ? 'badge-success' : 
									e.status === 'upcoming' ? 'badge-warning' : 'badge-neutral'
								}`}>
									{e.status === 'ongoing' ? 'Đang mở' : 
									 e.status === 'upcoming' ? 'Chưa mở' : 'Đã kết thúc'}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<p className="text-sm opacity-70">{e.course_id?.name || "Unassigned course"}</p>
								{e.course_id?.course_code && (
									<span className="badge badge-outline badge-sm">
										{e.course_id.course_code}
									</span>
								)}
							</div>
							<p className="text-xs">
								{new Date(e.start_time).toLocaleString()} — {new Date(e.end_time).toLocaleString()}
							</p>
							<div className="card-actions justify-end">
								{e.canAccess ? (
									<Link to={`/student/take-exam/${e._id}`} className="btn btn-primary btn-sm">
										Take exam
									</Link>
								) : (
									<button className="btn btn-disabled btn-sm" disabled>
										{e.status === 'upcoming' ? 'Chưa mở' : 'Đã kết thúc'}
									</button>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
			
			{/* No results message */}
			{exams.length === 0 && !loading && (
				<div className="text-center py-8">
					<p className="text-lg text-gray-500">No exams found matching your search criteria.</p>
				</div>
			)}
		</div>
	);
}
