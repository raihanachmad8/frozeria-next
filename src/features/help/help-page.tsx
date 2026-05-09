"use client";

import { InfoCircleOutlined } from "@ant-design/icons";
import { Card, Space, Tag, Typography } from "antd";

import {
  HELP_NOTES,
  HELP_PAGE_COPY,
  HELP_USAGE_SECTIONS,
  PARTICIPANT_IDENTITY,
  STOCK_GUIDES,
} from "./constants";

export function HelpPageContent() {
  return (
    <>
      <section className="page-heading help-page-heading">
        <div>
          <Typography.Title level={1}>{HELP_PAGE_COPY.title}</Typography.Title>
          <Typography.Paragraph>{HELP_PAGE_COPY.description}</Typography.Paragraph>
        </div>
      </section>

      <div className="help-layout">
        <Card className="help-guide-card" title={HELP_PAGE_COPY.usageGuideTitle}>
          {HELP_USAGE_SECTIONS.map((section) => (
            <section className="help-flow-block" key={section.title}>
              <Typography.Title level={3}>{section.title}</Typography.Title>
              <ol className="help-step-list">
                {section.steps.map((step, index) => (
                  <li key={`${section.title}-${index}`}>
                    <span className="help-step-number">{index + 1}</span>
                    <Typography.Text>
                      {step.map((segment) =>
                        segment.strong ? (
                          <strong key={`${section.title}-${index}-${segment.text}`}>{segment.text}</strong>
                        ) : (
                          segment.text
                        ),
                      )}
                    </Typography.Text>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </Card>

        <aside className="help-side-section">
          <Card className="help-card" title={HELP_PAGE_COPY.stockGuideTitle}>
            <Space orientation="vertical" size={10}>
              {STOCK_GUIDES.map((guide) => (
                <div className="help-stock-row" key={guide.label}>
                  <Tag className={`help-stock-badge help-stock-badge-${guide.tone}`}>{guide.label}</Tag>
                  <Typography.Text>{guide.description}</Typography.Text>
                </div>
              ))}
            </Space>
          </Card>

          <Card
            className="help-card help-note-card"
            title={
              <Space size={8}>
                <InfoCircleOutlined />
                {HELP_PAGE_COPY.noteTitle}
              </Space>
            }
          >
            <ul className="help-note-list">
              {HELP_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </Card>
        </aside>

        <Card className="help-identity-card" title={HELP_PAGE_COPY.identityTitle}>
          <dl className="help-identity-list">
            {PARTICIPANT_IDENTITY.map((item) => (
              <div className="help-identity-row" key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </>
  );
}
