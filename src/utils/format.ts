// Pure formatting helpers with no server-only dependencies (no `fs`), so
// they're safe to import from client components. Server code can still get
// these from the `@/utils` barrel; client components must import this file
// directly to avoid pulling `fs` into the client bundle.
const JS_DATE_WITH_GMT_OFFSET = /\bGMT([+-]\d{4})\b/;

const pad2 = (value: number) => value.toString().padStart(2, '0');

const getTimezoneLabel = (dateString: string): string => {
	const offsetMatch = dateString.match(JS_DATE_WITH_GMT_OFFSET);
	if (!offsetMatch) return '';

	const [, offset] = offsetMatch;
	if (offset === '-0400' || offset === '-0500') return 'ET';

	return `${offset.slice(0, 3)}:${offset.slice(3)}`;
}

export const formatBlogTimestamp = (dateString: string): string => {
	if (!JS_DATE_WITH_GMT_OFFSET.test(dateString)) return dateString;

	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return dateString;

	const timezone = getTimezoneLabel(dateString);
	const formatted = [
		date.getFullYear(),
		pad2(date.getMonth() + 1),
		pad2(date.getDate()),
	].join('-');

	return `${formatted} ${pad2(date.getHours())}:${pad2(date.getMinutes())}${timezone ? ` ${timezone}` : ''}`;
}
