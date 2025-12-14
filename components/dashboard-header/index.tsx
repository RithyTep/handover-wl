"use client"

import { CodingHeader } from "./coding-header"
import { ClashHeader } from "./clash-header"
import { StandardHeader } from "./standard-header"
import { DefaultHeader } from "./default-header"
import type { DashboardHeaderProps } from "./types"

export type { DashboardHeaderProps }

export const DashboardHeader = ({ theme, ticketCount }: DashboardHeaderProps) => {
	switch (theme) {
		case "coding":
			return <CodingHeader theme={theme} ticketCount={ticketCount} />
		case "clash":
			return <ClashHeader theme={theme} ticketCount={ticketCount} />
		case "default":
			return <DefaultHeader theme={theme} ticketCount={ticketCount} />
		default:
			return <StandardHeader theme={theme} ticketCount={ticketCount} />
	}
}
