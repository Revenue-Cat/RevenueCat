import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { SUBSCRIPTION_PLANS, Plan, PlanId } from "../config/subscriptions";

type Props = {
  plans?: Plan[];
  defaultSelectedId?: PlanId;
  onSelect?: (plan: Plan) => void;
  onUnlock?: (plan: Plan) => void;
};

const idToKey = (id: string) => {
  switch (id) {
    case "year":
    case "yearly":
      return "yearly";
    case "quarter":
    case "quarterly":
    case "3m":
      return "quarterly";
    case "month":
    case "monthly":
      return "monthly";
    default:
      return id; // fallback
  }
};

const SubscriptionPicker: React.FC<Props> = ({
  plans = SUBSCRIPTION_PLANS,
  defaultSelectedId = "year",
  onSelect,
  onUnlock,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();

  const [activeId, setActiveId] = useState<PlanId>(defaultSelectedId);
  const borderColor = isDark ? "#A78BFA" : "#4F46E5";
  const bgSoft = isDark ? "bg-slate-700" : "bg-indigo-50";
  const textPrimary = isDark ? "text-white" : "text-indigo-950";
  const textMuted = isDark ? "text-slate-300" : "text-slate-500";

  const activePlan = useMemo(
    () => plans.find((p) => p.id === activeId) || plans[0],
    [plans, activeId]
  );

  return (
    <View className="px-4">
      {plans.map((p) => {
        const selected = p.id === activeId;
        const key = idToKey(p.id);
        // Localized strings with fallback to config values
        const label = t(`subscriptions.plans.${key}.title`, p.label);
        const cadence = t(`subscriptions.plans.${key}.billing`, p.cadenceNote);
        const discountText =
          p.discountTag ??
          (typeof (p as any).discountPercent === "number"
            ? t("subscriptions.save", { percent: (p as any).discountPercent })
            : undefined);

        return (
          <Pressable
            key={p.id}
            onPress={() => {
              setActiveId(p.id);
              onSelect?.(p);
            }}
            className={`rounded-3xl px-5 py-4 mb-3 ${bgSoft} ${
              selected && "border-2"
            }`}
            style={selected ? { borderColor } : undefined}
          >
            {!!discountText && (
              <View
                className="absolute -top-3 left-6 rounded-full px-3 py-1"
                style={{ backgroundColor: borderColor }}
              >
                <Text className="text-white font-bold text-xs">
                  {discountText}
                </Text>
              </View>
            )}

            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className={`${textPrimary} font-extrabold`}
                  style={{ fontSize: 22 }}
                >
                  {label}
                </Text>
                <Text className={`${textMuted} font-semibold mt-1`}>
                  {cadence}
                </Text>
              </View>

              <View className="items-end">
                <Text
                  className={`${textPrimary} font-extrabold`}
                  style={{ fontSize: 28 }}
                >
                  {p.price.toFixed(2)} {p.currency}
                </Text>
                {!!p.oldPrice && (
                  <Text className="text-slate-400 line-through mt-1 font-bold">
                    {p.oldPrice.toFixed(2)} {p.currency}
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        );
      })}

      <Pressable
        onPress={() => onUnlock?.(activePlan)}
        className="mt-4 rounded-3xl items-center justify-center"
        style={{ backgroundColor: borderColor, paddingVertical: 16 }}
      >
        <Text className="text-white font-bold text-lg">
          {t("subscriptions.cta", "Unlock the entire program")}
        </Text>
      </Pressable>
    </View>
  );
};

export default SubscriptionPicker;
