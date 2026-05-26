class Task < ApplicationRecord
  validates :title, presence: true, length: { maximum: 255 }
  validates :status, inclusion: { in: %w[pending in_progress completed] }, allow_nil: true

  after_initialize { self.status ||= "pending" }

  scope :filter_by_status, ->(status) { where(status: status) if status.present? }
end
