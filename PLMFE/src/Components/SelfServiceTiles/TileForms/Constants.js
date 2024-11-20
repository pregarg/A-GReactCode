import React from "react";

export const RenderType = {
  PROVIDER_DISPUTE: "PROVIDER_DISPUTE",
  APPEALS: "APPEALS",
};

export const chunkArray = (arr, chunkSize, filter = undefined) => {
  return (arr || []).reduce((result, item, idx) => {
    if (filter && !filter(item)) return result;
    const chunkIdx = Math.floor(result.flatMap((e) => e).length / chunkSize);
    if (!result[chunkIdx]) {
      result[chunkIdx] = [];
    }
    result[chunkIdx].push(item);
    return result;
  }, []);
};

export const renderElements = (
  fields,
  renderSelectField,
  renderInputField,
  renderDatePicker,
) => {
  return chunkArray(fields, 3).map((chunk) => (
    <div className="row my-2">
      {chunk.map((item) => {
        return (
          (item.type === "select" &&
            renderSelectField(item.name, item.placeholder, item.values)) ||
          (item.type === "input" &&
            renderInputField(item.name, item.placeholder, item.maxLength)) ||
          (item.type === "date" &&
            renderDatePicker(item.name, item.placeholder, item.label)) 
        );
      })}
    </div>
  ));
};

export const paramMap = {
  intake: {
    label: 'Intake',
    flowId: '3'
  },
  acknowledge: {
    label: 'Acknowledge',
    flowId: '3'
  },
  caseCompleted: {
    label: 'Case Completed',
    flowId: '3'
  },
  caseArchived: {
    label: 'CaseArchived',
    flowId: '3'
  },
  documentsNeeded: {
    label: 'Documents Needed',
    flowId: '3'
  },
  effectuate: {
    label: 'Effectuate',
    flowId: '3'
  },
  network: {
    label: 'Network',
    flowId: '3'
  },
  redirectReview: {
    label: 'Redirect Review',
    flowId: '3'
  },
  reopen: {
    label: 'Reopen',
    flowId: '3'
  },
  research: {
    label: 'Research',
    flowId: '3'
  },
  resolve: {
    label: 'Resolve',
    flowId: '3'
  },
  start: {
    label: 'Start',
    flowId: '3'
  },
  bulkEffectuate: {
    label: 'Bulk Effectuate',
    flowId: '3'
  }
}
