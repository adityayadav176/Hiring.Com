import { useState } from "react";
import {
  X,
  FileText,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";
import { useApplication } from "../../hooks/Hook";

const ApplyJobModal = ({ job, onClose }) => {
  const { applyForJob, loading } = useApplication();

  const [formData, setFormData] = useState({
    resumeId: job?.resumeId || "",
    coverLetter: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.resumeId) {
      setMessage("Please select a resume.");
      return;
    }

    const result = await applyForJob(job._id, formData);

    if (result.success) {
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMessage(result.message || "Something went wrong.");
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Send className="h-7 w-7 text-green-600" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Application Submitted!
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your application has been successfully sent to the recruiter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Apply for this job
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {job?.title || "Job Position"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Resume */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <FileText size={17} />
              Select Resume
            </label>

            <select
              name="resumeId"
              value={formData.resumeId}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">Select your resume</option>
              <option value="resume-1">
                Software Developer Resume
              </option>
              <option value="resume-2">
                Full Stack Developer Resume
              </option>
            </select>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <MessageSquare size={17} />
              Message to recruiter
            </label>

            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={7}
              placeholder="Tell the recruiter why you're a good fit for this role..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />

            <p className="mt-2 text-xs text-slate-400">
              Keep your message short and relevant to the job.
            </p>
          </div>

          {/* Error */}
          {message && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;