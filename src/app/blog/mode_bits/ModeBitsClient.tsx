"use client";

import Link from "next/link";
import "./mode_bits.css";
import { myCustomFont } from '@/ui/font';
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type NumberBase = "decimal" | "hex" | "octal";

type ModeBitsState = {
	value: number;
	base: NumberBase;
};

const bitGroups = [
	{ label: "File type", bits: ["f", "f", "f", "f"] },
	{ label: "Special", bits: ["su", "sg", "st"] },
	{ label: "Owner", bits: ["r", "w", "x"] },
	{ label: "Group", bits: ["r", "w", "x"] },
	{ label: "Other", bits: ["r", "w", "x"] },
];

const BIT_LABELS = bitGroups.flatMap((group) => group.bits);
const BIT_COUNT = BIT_LABELS.length;
const MAX_MODE_VALUE = (1 << BIT_COUNT) - 1;

const baseOptions: Record<NumberBase, { label: string; radix: number; prefix: string }> = {
	decimal: { label: "Decimal", radix: 10, prefix: "" },
	hex: { label: "Hex", radix: 16, prefix: "0x" },
	octal: { label: "Octal", radix: 8, prefix: "0o" },
};

const modeFlags = {
	S_IFMT: 0o170000,
	S_IFSOCK: 0o140000,
	S_IFLNK: 0o120000,
	S_IFREG: 0o100000,
	S_IFBLK: 0o060000,
	S_IFDIR: 0o040000,
	S_IFCHR: 0o020000,
	S_IFIFO: 0o010000,
	S_ISUID: 0o004000,
	S_ISGID: 0o002000,
	S_ISVTX: 0o001000,
	S_IRUSR: 0o000400,
	S_IWUSR: 0o000200,
	S_IXUSR: 0o000100,
	S_IRGRP: 0o000040,
	S_IWGRP: 0o000020,
	S_IXGRP: 0o000010,
	S_IROTH: 0o000004,
	S_IWOTH: 0o000002,
	S_IXOTH: 0o000001,
};

const fileTypes = [
	{ flag: "S_IFREG", value: modeFlags.S_IFREG, label: "regular file" },
	{ flag: "S_IFDIR", value: modeFlags.S_IFDIR, label: "directory" },
	{ flag: "S_IFSOCK", value: modeFlags.S_IFSOCK, label: "socket" },
	{ flag: "S_IFLNK", value: modeFlags.S_IFLNK, label: "symbolic link" },
	{ flag: "S_IFBLK", value: modeFlags.S_IFBLK, label: "block device" },
	{ flag: "S_IFCHR", value: modeFlags.S_IFCHR, label: "character device" },
	{ flag: "S_IFIFO", value: modeFlags.S_IFIFO, label: "fifo" },
];

const clampModeValue = (value: number) => Math.max(0, Math.min(value, MAX_MODE_VALUE));

const parseModeValue = (rawValue: string, base: NumberBase) => {
	const { radix, prefix } = baseOptions[base];
	const normalizedValue = rawValue.trim().toLowerCase();
	const valueWithoutPrefix = prefix && normalizedValue.startsWith(prefix)
		? normalizedValue.slice(prefix.length)
		: normalizedValue;
	const parsedValue = Number.parseInt(valueWithoutPrefix || "0", radix);

	return Number.isNaN(parsedValue) ? 0 : clampModeValue(parsedValue);
};

const formatModeValue = (value: number, base: NumberBase) => {
	const { radix, prefix } = baseOptions[base];
	return `${prefix}${value.toString(radix)}`;
};

const getFileType = (modeValue: number) => {
	const fileTypeValue = modeValue & modeFlags.S_IFMT;
	return fileTypes.find((fileType) => fileType.value === fileTypeValue);
};

const cycleFileType = (modeValue: number) => {
	const currentFileTypeValue = modeValue & modeFlags.S_IFMT;
	const currentIndex = fileTypes.findIndex((fileType) => fileType.value === currentFileTypeValue);
	const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % fileTypes.length;

	return (modeValue & ~modeFlags.S_IFMT) | fileTypes[nextIndex].value;
};

const getPermissionString = (
	modeValue: number,
	readFlag: number,
	writeFlag: number,
	executeFlag: number
) => {
	return [
		modeValue & readFlag ? "r" : "-",
		modeValue & writeFlag ? "w" : "-",
		modeValue & executeFlag ? "x" : "-",
	].join("");
};

const getModeInterpretation = (modeValue: number) => {
	const fileType = getFileType(modeValue);
	const specialBits = [
		modeValue & modeFlags.S_ISUID ? "setuid" : null,
		modeValue & modeFlags.S_ISGID ? "setgid" : null,
		modeValue & modeFlags.S_ISVTX ? "sticky" : null,
	].filter(Boolean).join(", ");

	const writeAccess = [
		modeValue & modeFlags.S_IWUSR ? "owner" : null,
		modeValue & modeFlags.S_IWGRP ? "group" : null,
		modeValue & modeFlags.S_IWOTH ? "other" : null,
	].filter(Boolean).join(", ");

	return [
		["File type", fileType ? fileType.label : "-"],
		["Special behavior", specialBits || "None"],
		["Owner permissions", getPermissionString(modeValue, modeFlags.S_IRUSR, modeFlags.S_IWUSR, modeFlags.S_IXUSR)],
		["Group permissions", getPermissionString(modeValue, modeFlags.S_IRGRP, modeFlags.S_IWGRP, modeFlags.S_IXGRP)],
		["Other permissions", getPermissionString(modeValue, modeFlags.S_IROTH, modeFlags.S_IWOTH, modeFlags.S_IXOTH)],
	];
};

const getModeHelpers = (modeValue: number) => {
	const fileTypeBits = modeValue & modeFlags.S_IFMT;
	const fileTypeHelpers = fileTypes.map((fileType) => ({
		question: `Is this a ${fileType.label}?`,
		expression: `((mode & S_IFMT) == ${fileType.flag})`,
		result: fileTypeBits === fileType.value,
	}));

	const specialHelpers = [
		{ question: "Is setuid enabled?", expression: "(mode & S_ISUID)", flag: modeFlags.S_ISUID },
		{ question: "Is setgid enabled?", expression: "(mode & S_ISGID)", flag: modeFlags.S_ISGID },
		{ question: "Is sticky enabled?", expression: "(mode & S_ISVTX)", flag: modeFlags.S_ISVTX },
	].map((helper) => ({
		...helper,
		result: Boolean(modeValue & helper.flag),
	}));

	const permissionHelpers = [
		{ subject: "owner", action: "read", expression: "(mode & S_IRUSR)", flag: modeFlags.S_IRUSR },
		{ subject: "owner", action: "write", expression: "(mode & S_IWUSR)", flag: modeFlags.S_IWUSR },
		{ subject: "owner", action: "execute", expression: "(mode & S_IXUSR)", flag: modeFlags.S_IXUSR },
		{ subject: "group", action: "read", expression: "(mode & S_IRGRP)", flag: modeFlags.S_IRGRP },
		{ subject: "group", action: "write", expression: "(mode & S_IWGRP)", flag: modeFlags.S_IWGRP },
		{ subject: "group", action: "execute", expression: "(mode & S_IXGRP)", flag: modeFlags.S_IXGRP },
		{ subject: "other", action: "read", expression: "(mode & S_IROTH)", flag: modeFlags.S_IROTH },
		{ subject: "other", action: "write", expression: "(mode & S_IWOTH)", flag: modeFlags.S_IWOTH },
		{ subject: "other", action: "execute", expression: "(mode & S_IXOTH)", flag: modeFlags.S_IXOTH },
	].map((helper) => ({
		question: `Can ${helper.subject} ${helper.action}?`,
		expression: helper.expression,
		result: Boolean(modeValue & helper.flag),
	}));

	return [
		...permissionHelpers,
		...fileTypeHelpers,
		...specialHelpers,
	];
};

const modeValueToBits = (value: number) => {
	return Array.from({ length: BIT_COUNT }, (_, idx) => {
		const shift = BIT_COUNT - idx - 1;
		return (value >> shift) & 1;
	});
};

const populateBits = (modeValue: number, setModeBits: Dispatch<SetStateAction<ModeBitsState>>) => {
	return modeValueToBits(modeValue).map((x, idx) => (
		<button
			className={`mode-bit-button ${x ? "mode-bit-button-on" : "mode-bit-button-off"}`}
			key={idx}
			type="button"
			aria-label={`Toggle ${BIT_LABELS[idx]} bit`}
			onClick={() => {
				const shift = BIT_COUNT - idx - 1;
				const mask = 1 << shift;

				setModeBits((current) => ({
					...current,
					value: current.value ^ mask,
				}));
			}}
		>
			{BIT_LABELS[idx]}
		</button>
	));
};

const populateBitGroupLabels = (setModeBits: Dispatch<SetStateAction<ModeBitsState>>) => {
	let startColumn = 1;

	return bitGroups.map((group) => {
		const gridColumn = `${startColumn} / span ${group.bits.length}`;
		startColumn += group.bits.length;

		if (group.label === "File type") {
			return (
				<button
					key={group.label}
					className="mode-bit-group-label mode-bit-group-toggle"
					style={{ gridColumn }}
					type="button"
					onClick={() => {
						setModeBits((current) => ({
							...current,
							value: cycleFileType(current.value),
						}));
					}}
				>
					{group.label}
				</button>
			);
		}

		return (
			<div
				key={group.label}
				className="mode-bit-group-label"
				style={{ gridColumn }}
			>
				{group.label}
			</div>
		);
	});
};

const populateInterpretation = (modeValue: number) => {
	return getModeInterpretation(modeValue).map(([label, value]) => (
		<tr key={label}>
			<th>{label}</th>
			<td>{value}</td>
		</tr>
	));
};

const populateHelpers = (modeValue: number) => {
	return getModeHelpers(modeValue).map((helper) => (
		<tr
			key={helper.expression}
			className={helper.result ? "mode-helper-row-pass" : "mode-helper-row-fail"}
		>
			<td>{helper.question}</td>
			<td><code>{helper.expression}</code></td>
			{/* <td>{helper.result ? "true" : "false"}</td> */}
		</tr>
	));
};

export default function ModeBitsClient() {
	const [modeBits, setModeBits] = useState<ModeBitsState>({
		value: 0o2615,
		base: "octal",
	});

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setModeBits((current) => ({
			...current,
			value: parseModeValue(event.target.value, current.base),
		}));
	};

	const handleBaseChange = (event: ChangeEvent<HTMLInputElement>) => {
		setModeBits((current) => ({
			...current,
			base: event.target.value as NumberBase,
		}));
	};

	return (
		<>
			<div className={myCustomFont.className}
				style={{ fontSize: "40px", marginBottom: "20px" }}
			><code>stat(2)</code> mode visualizer.</div>

			<div> <Link href="https://github.com/stupendoussuperpowers/stupendoussuperpowers.github.io/tree/main/src/app/blog/mode_bits">Source Code</Link>
				<span> </span><Link href="/">Request a Feature</Link>
			</div>
			<p>
				A Linux/Unix <code>stat(2)</code> mode bit visualizer for decoding file type bits,
				permission bits, and special mode flags. Build your own mode flag, interpret an existing one, and know what checks to perform.
			</p>
			<div>
				<div className="mode-bits-control-row">
					<div className="mode-bits-base-options">
						{Object.entries(baseOptions).map(([value, { label }]) => (
							<label key={value} className="mode-bits-base-option">
								<input
									type="radio"
									name="mode-base"
									value={value}
									checked={modeBits.base === value}
									onChange={handleBaseChange}
								/>
								{label}
							</label>
						))}
					</div>
					<input value={formatModeValue(modeBits.value, modeBits.base)} onChange={handleInputChange}></input>
				</div>
				<div className="mode-bits-row">
					{populateBits(modeBits.value, setModeBits)}
					{populateBitGroupLabels(setModeBits)}
				</div>
				<div className="mode-bits-details">
					<section>
						<table className="mode-bits-table">
							<tbody>
								{populateInterpretation(modeBits.value)}
							</tbody>
						</table>
					</section>
					<section>
						<table className="mode-bits-table">
							<tbody>
								{populateHelpers(modeBits.value)}
							</tbody>
						</table>
					</section>
				</div>
			</div>
			<hr />
		</>
	);
}
