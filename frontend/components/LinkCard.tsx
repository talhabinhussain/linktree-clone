"use client";

import { Link as LinkType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getIconComponent } from "@/lib/icons";
import { forwardRef } from "react";

interface LinkCardProps {
  link: LinkType;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditable?: boolean;
  themeColor?: string;
  isDragging?: boolean;
  dragHandleProps?: any;
}

const LinkCard = forwardRef<HTMLDivElement, LinkCardProps>(
  (
    {
      link,
      onEdit,
      onDelete,
      isEditable = false,
      themeColor = "#3b82f6",
      isDragging,
      dragHandleProps,
    },
    ref,
  ) => {
    // Get icon component from icon map
    const IconComponent = getIconComponent(link.icon);

    const handleClick = () => {
      if (!isEditable && link.url) {
        window.open(link.url, "_blank");
      }
    };

    function formatShortUrl(rawUrl?: string) {
      if (!rawUrl) return "";
      try {
        const u = new URL(rawUrl);
        // Keep protocol + host + pathname (no query/hash) for smallest clear form
        return `${u.protocol}//${u.hostname}${u.pathname.replace(/\/$/, "")}`;
      } catch (e) {
        // Fallback: return raw trimmed
        return rawUrl;
      }
    }

    return (
      <div
        ref={ref}
        className={`transition-all ${isDragging ? "opacity-50" : ""}`}
        {...dragHandleProps}
      >
        <Card
          className="p-4 cursor-pointer transition-all hover:shadow-lg"
          style={{
            borderColor: themeColor,
            borderWidth: "2px",
          }}
          onClick={handleClick}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg text-white flex-shrink-0"
              style={{ backgroundColor: themeColor }}
            >
              <IconComponent size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{link.title}</h3>
              {/* Show a compact URL preview for non-editable views; editable shows full URL */}
              {isEditable ? (
                <p className="text-xs text-muted-foreground truncate">
                  {link.url}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground truncate">
                  {formatShortUrl(link.url)}
                </p>
              )}
            </div>

            {isEditable && (
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  },
);

LinkCard.displayName = "LinkCard";

export default LinkCard;
