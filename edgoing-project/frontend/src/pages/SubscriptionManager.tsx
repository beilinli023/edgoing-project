
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import SubscriptionList from "@/components/subscription/SubscriptionList";

const SubscriptionManager = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader 
        title="订阅邮件管理" 
        description="管理网站邮件订阅者列表" 
        backUrl="/admin"
      />

      <div className="space-y-4 mt-6">
        <SubscriptionList />
      </div>
    </div>
  );
};

export default SubscriptionManager;
