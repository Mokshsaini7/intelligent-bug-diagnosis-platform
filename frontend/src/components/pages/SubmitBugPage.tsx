```tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bug } from "lucide-react";

import { submissionService } from "../services/submissionService";

import type { BugSubmissionCreate } from "../types/submission";

import BugSubmissionForm from "../components/submissions/BugSubmissionForm";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";

function SubmitBugPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: BugSubmissionCreate) => {
    const submission = await submissionService.create(data);

    navigate(`/reports/${submission.id}`, {
      replace: true,
      state: {
        message: "Bug report submitted successfully.",
      },
    });
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="page-container space-y-6">
      <button
        type="button"
        onClick={handleCancel}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <PageHeader
        eyebrow="Bug Management"
        title="Submit a Bug Report"
        description="Provide detailed information about the issue so it can be investigated and diagnosed."
      />

      <SectionCard
        title="New Bug Report"
        description="Fields marked as required must be completed."
      >
        <BugSubmissionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </SectionCard>

      <div className="flex items-start gap-3 rounded-xl border border-info/20 bg-info/5 p-4">
        <Bug
          size={19}
          className="mt-0.5 shrink-0 text-info"
          aria-hidden="true"
        />

        <div>
          <p className="text-sm font-medium text-foreground">
            Before submitting
          </p>
          <p className="mt-1 text-sm leading-6 text-muted">
            Include clear reproduction steps and relevant error logs.
            Remove passwords, API keys, tokens, and other sensitive
            information before submitting.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubmitBugPage;
```
