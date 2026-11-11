```tsx
import {
  ClipboardList,
  Code2,
  FileCode2,
  Laptop,
  Terminal,
} from "lucide-react";

import type { BugSubmission } from "../../types/submission";

import SectionCard from "../ui/SectionCard";
import CodeBlock from "../ui/CodeBlock";
import Divider from "../ui/Divider";

interface SubmissionDetailsProps {
  submission: BugSubmission;
  className?: string;
}

interface DetailSectionProps {
  title: string;
  content?: string | null;
  placeholder?: string;
  icon: React.ElementType;
}

function DetailSection({
  title,
  content,
  placeholder = "No information provided.",
  icon: Icon,
}: DetailSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon
          size={17}
          className="text-muted"
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>
      </div>

      {content?.trim() ? (
        <div className="whitespace-pre-wrap break-words rounded-lg border border-border bg-elevated/40 p-4 text-sm leading-6 text-muted">
          {content}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">
          {placeholder}
        </p>
      )}
    </div>
  );
}

function SubmissionDetails({
  submission,
  className = "",
}: SubmissionDetailsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <SectionCard
        title="Technical Environment"
        description="Development environment and technology information."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Code2 size={18} className="mt-0.5 text-muted" />
            <div>
              <p className="text-xs text-muted">
                Programming Language
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {submission.programming_language || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileCode2 size={18} className="mt-0.5 text-muted" />
            <div>
              <p className="text-xs text-muted">Framework</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {submission.framework || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:col-span-2">
            <Laptop size={18} className="mt-0.5 text-muted" />
            <div>
              <p className="text-xs text-muted">Environment</p>
              <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-foreground">
                {submission.environment || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Reproduction Details"
        description="Steps and expected behavior for reproducing the issue."
      >
        <div className="space-y-5">
          <DetailSection
            title="Steps to Reproduce"
            content={submission.steps_to_reproduce}
            icon={ClipboardList}
          />

          <Divider />

          <DetailSection
            title="Expected Behavior"
            content={submission.expected_behavior}
            icon={FileCode2}
          />

          <Divider />

          <DetailSection
            title="Actual Behavior"
            content={submission.actual_behavior}
            icon={Laptop}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Technical Evidence"
        description="Stack traces and application logs supplied with the report."
      >
        <div className="space-y-5">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Terminal size={17} className="text-muted" />
              <h3 className="text-sm font-semibold text-foreground">
                Stack Trace
              </h3>
            </div>

            {submission.stack_trace?.trim() ? (
              <CodeBlock
                code={submission.stack_trace}
                language="text"
                title="Stack Trace"
              />
            ) : (
              <p className="text-sm text-muted">
                No stack trace provided.
              </p>
            )}
          </div>

          <Divider />

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Terminal size={17} className="text-muted" />
              <h3 className="text-sm font-semibold text-foreground">
                Error Logs
              </h3>
            </div>

            {submission.error_logs?.trim() ? (
              <CodeBlock
                code={submission.error_logs}
                language="text"
                title="Error Logs"
              />
            ) : (
              <p className="text-sm text-muted">
                No error logs provided.
              </p>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export default SubmissionDetails;
```
