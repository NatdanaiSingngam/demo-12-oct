// Shared Tailwind class sets. Size, tone, and spacing are separate parameters so a caller never
// combines two utilities that set the same property (their order in the generated CSS would decide).
export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

type Tone = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'md' | 'sm' | 'lg' | 'none';
const BTN_TONE: Record<Tone, string> = {
  primary: 'bg-brand text-white shadow-[0_3px_5px_#214c3b0b] hover:bg-brand-hover',
  outline: 'border border-[#dde4da] bg-white hover:bg-[#f2f5ee]',
  ghost: 'hover:bg-[#edf1e9]',
  danger: 'text-[#b8675c]'
};
const BTN_SIZE: Record<Size, string> = {
  md: 'gap-2.25 px-4.5 py-2.75 text-15 min-h-10.75',
  sm: 'gap-2.25 px-3 py-1.75 text-14 min-h-8.5',
  lg: 'gap-2.25 px-5.75 py-3.75 text-16 min-h-10.75',
  none: ''
};
/** `size: 'none'` lets `extra` supply gap/padding/font-size/min-height itself. */
export const btn = (tone: Tone, size: Size = 'md', extra = '') => cx('inline-flex items-center justify-center rounded-[9px] font-medium whitespace-nowrap transition-[background-color,transform] duration-150', BTN_TONE[tone], BTN_SIZE[size], extra);
/** Page-heading action: shrinks on phones, wraps under the title on very small screens. */
export const headingBtn = (tone: Tone) => btn(tone, 'none', 'self-center gap-2.25 px-4.5 py-2.75 text-15 min-h-10.75 max-sm:px-3 max-sm:py-2.25 max-sm:text-13 max-sm:min-h-9.5 max-xs:self-start');

export function iconBtn({ className = '', size = 'size-8.5', display = 'inline-flex', danger = false }: { className?: string; size?: string; display?: string; danger?: boolean } = {}) {
  return cx(display, 'items-center justify-center shrink-0 rounded-lg p-0', size, danger ? 'text-[#b8675c] hover:bg-danger-tint' : 'hover:bg-[#eaf0e6]', className);
}
/** Visible only below the `sm` breakpoint. */
export const mobileIconBtn = (className = '') => iconBtn({ className, display: 'hidden max-sm:inline-flex' });
export const textBtn = (look = 'text-14 text-brand hover:text-[#153729]') => cx('inline-flex items-center gap-1.75 py-1.25 font-medium', look);
export const backLink = 'inline-flex items-center gap-2 mb-5 p-0 text-15 text-[#6d7f72] hover:text-brand';

/** `size` must include font-size and letter-spacing. */
export const eyebrow = (size = 'text-[.74rem] tracking-[1.9px]', extra = '') => cx('block font-semibold leading-[1.8] text-[#657163]', size, extra);
export const tinyDot = 'inline-block size-1.5 rounded-full bg-[#70a164]';
export const panel = 'min-w-0 overflow-hidden rounded-xl border border-line bg-white';
export const sectionHeading = (padding = 'px-5.75 pt-5.5 pb-4.5 max-sm:p-5', extra = '') => cx('flex items-center justify-between gap-3.75', padding, extra);
export const sectionTitle = 'text-[1.04rem] text-sage-dark';
export const sectionSub = 'mt-1 text-12 text-muted';
export const sectionIcon = 'text-muted stroke-[1.6]';
export const countChip = 'ml-1.25 inline-flex size-5.25 items-center justify-center rounded-md bg-[#f0f4e7] align-middle font-[DM_Sans,sans-serif] text-11 text-sage';

export const formError = 'mb-4.25 rounded-lg border border-danger-line bg-danger-tint px-3.5 py-3 text-14 leading-[1.8] text-danger';
export const formWarning = 'form-warning mb-4.25 flex items-start gap-2 rounded-lg border border-gold-line bg-[#fcf7e9] px-3.5 py-3 text-13 leading-[1.8] text-gold [&_svg]:mt-0.75';
export const summaryNote = 'my-5 flex gap-2.5 rounded-lg bg-[#f6f9f0] px-3 py-3.25 text-12 leading-[1.8] text-[#637452] [&>svg]:mt-0.75';
export const searchField = (width = 'max-w-[350px]') => cx('m-0 flex w-full min-w-0 items-center gap-2.25 rounded-lg border border-[#e2e8d9] bg-white px-3 text-[#69715d] focus-within:outline-2 focus-within:outline-[#a8bb94] [&_input]:m-0 [&_input]:min-h-10.25 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-0 [&_input]:py-2.5 [&_input]:text-14 [&_input]:focus:outline-none', width);
export const progressTrack = (height = 'h-1.5') => cx('overflow-hidden rounded-full bg-[#ecf0e7]', height);
export const progressBar = 'block h-full rounded-full bg-[#6c9760] transition-[width] duration-350';
export const userAvatar = 'grid size-8.5 shrink-0 place-items-center rounded-full bg-tint-3 text-15 text-[#738652]';
export const noticeIcon = 'grid size-8.5 shrink-0 place-items-center rounded-[10px] bg-[#f1f5e7] text-[#64744e]';
export const filterTabs = 'flex flex-wrap items-center gap-2 max-sm:gap-1';
export const filterTab = (active: boolean) => cx('flex items-center gap-2.25 rounded-[7px] px-3.5 py-2.25 text-14 max-sm:px-2.5 max-sm:py-2 max-sm:text-13 [&>span]:min-w-5 [&>span]:rounded [&>span]:bg-white/55 [&>span]:px-1.5 [&>span]:text-11 [&>span]:leading-5', active ? 'bg-[#e8efdf] text-[#5c7848] hover:bg-[#e8efdf]' : 'text-[#687160] hover:bg-[#edf2e5]');

const BADGE: Record<string, string> = {
  todo: 'text-[#6a705c] bg-[#f2f5ec]',
  doing: 'text-[#776f47] bg-[#f8f4e6]',
  done: 'text-[#5f7645] bg-[#eef5e5]',
  late: 'text-[#8c684f] bg-[#fbf0e5]',
  neutral: 'text-[#6b6f68] bg-[#f1f3ed]',
  'due-soon': 'text-[#967637] bg-[#fcf4df]'
};
export const badge = (kind = '', extra = '') => cx('inline-flex items-center gap-1 whitespace-nowrap rounded-[5px] px-2 py-0.75 text-11 font-normal leading-[1.6]', BADGE[kind] || 'text-[#6c6f65] bg-[#f4f5f0]', extra);

// Stat tiles shared by the student dashboard and the admin overview.
export const statCard = 'rounded-[11px] border border-line bg-white px-5 py-4.5 max-lg:p-4 max-sm:p-4.25 max-xs:px-3.25 max-xs:py-3.75';
export const statLabel = 'flex items-center justify-between gap-2.5 text-13 text-[#687061] max-lg:text-12 max-md:text-14 max-sm:text-13 max-xs:gap-1.25 max-xs:text-12';
export const statIcon = (warning = false) => cx('flex size-7.75 items-center justify-center rounded-lg max-xs:size-6.25 [&_svg]:w-4 [&_svg]:stroke-[1.8]', warning ? 'bg-[#fcf4e9] text-[#806b51]' : 'bg-[#f5f7ee] text-[#677258]');
export const statValue = (warning = false) => cx('mt-1.75 block text-[2.03rem] font-medium leading-normal tracking-[-1px] max-sm:text-[1.9rem]', warning ? 'text-[#8f674a]' : 'text-[#3c5838]');
export const statNote = 'text-11 text-[#6a7063] max-lg:text-[.66rem] max-md:text-12 max-sm:text-[.72rem] max-xs:text-[.68rem]';
export const statsGrid = (columns = 'grid-cols-4 max-md:grid-cols-2') => cx('stats-grid mb-6.25 grid gap-4 xl:gap-5.5 max-lg:gap-3 max-xs:gap-2.5', columns);

// Workspace shell shared by the student and admin areas.
export const sidebar = (open: boolean) => cx('sidebar fixed inset-y-0 left-0 z-30 flex w-[246px] flex-col overflow-y-auto border-r border-line bg-white px-5 pt-7.25 max-lg:w-[220px] max-lg:px-3.75 max-lg:pt-6.5 max-sm:w-[260px] max-sm:transition-transform max-sm:duration-200', !open && 'max-sm:-translate-x-full');
export const sidebarBrand = 'px-1.75 pb-6.25 max-sm:flex max-sm:items-center max-sm:justify-between';
export const workspaceLabel = 'mb-7.75 flex items-center gap-2.5 rounded-[10px] border border-[#ebeee4] bg-[#f7f8f2] p-2.75 [&_strong]:text-13 [&_strong]:font-medium [&_small]:block [&_small]:text-11 [&_small]:text-[#6a7064]';
export const workspaceAvatar = 'grid size-7.25 place-items-center rounded-[7px] bg-[#e8eddd] text-15 font-semibold text-[#688557]';
export const navLabel = (margin = 'mb-3') => cx('flex items-center justify-between px-3 text-[.66rem] tracking-[1.7px] text-[#697066]', margin);
export const sideNav = 'side-nav flex flex-col gap-1.75';
export const sideNavItem = (active: boolean) => cx('flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-[.96rem]', active ? 'bg-[#eaf1e2] font-medium text-[#386345] [&_svg]:stroke-2' : 'text-[#66725f] hover:bg-[#f7f8f2] [&_svg]:stroke-[1.6]');
export const sidebarTip = (bg = 'bg-[#f6f8ed]') => cx('mb-4.75 rounded-[11px] border border-[#e8eed8] p-4 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span]:text-[.65rem] [&>span]:tracking-[1.2px] [&>span]:text-[#67734b] [&_p]:mt-2.25 [&_p]:text-13 [&_p]:leading-[1.8] [&_p]:text-[#7b8969]', bg);
export const userCard = 'flex items-center gap-2.25 border-t border-[#edf0e8] pt-4.75 pb-5 [&>div]:min-w-0 [&>div]:flex-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-13 [&_strong]:font-medium [&_small]:block [&_small]:text-11 [&_small]:text-[#697063]';
export const scrim = 'fixed inset-0 z-25 hidden bg-[#1f352551] max-sm:block';
export const workspaceMain = 'ml-[246px] w-[calc(100%-246px)] min-w-0 max-lg:ml-[220px] max-lg:w-[calc(100%-220px)] max-sm:m-0 max-sm:w-full';
export const topbar = 'sticky top-0 z-15 flex h-19 items-center justify-between gap-3.5 border-b border-line bg-white/74 px-9.25 backdrop-blur-md xl:px-12.5 max-lg:px-6.25 max-sm:h-16 max-sm:px-4.5';
export const topbarGroup = 'flex items-center gap-3 text-13 max-sm:gap-2';
export const topbarDate = 'flex items-center gap-1.75 text-12 text-[#6a7062] max-sm:hidden';
export const demoTag = (size = 'text-[.59rem]') => cx('flex items-center gap-1.5 rounded-[5px] border border-[#e5ebd4] bg-[#f2f5e8] px-1.5 py-0.75 tracking-[.8px] text-[#66734e]', size);
export const content = 'mx-auto max-w-[1500px] px-9.25 pt-8.5 xl:px-12.5 xl:pt-11.25 max-lg:px-6.25 max-lg:pt-7 max-sm:px-5 max-sm:pt-6.5 max-xs:px-3.75 max-xs:pt-5.75';
export const pageHeading = 'page-heading mb-6.5 flex items-center justify-between gap-6 max-sm:mb-5.75 max-sm:items-start max-sm:gap-3.75 max-xs:flex-wrap';
export const pageEyebrow = eyebrow('text-[.65rem] tracking-[1.6px] max-sm:text-[.59rem] max-sm:tracking-[1.2px]', 'mb-1.5');
export const pageTitle = 'flex items-center gap-2.5 text-[1.96rem] font-semibold [overflow-wrap:anywhere] max-md:text-[1.8rem] max-sm:text-[1.65rem]';
export const pageSub = 'mt-1.5 text-14 text-[#6a7063] max-sm:text-13';
export const footer = (extra = '') => cx('mt-4.75 flex items-center justify-between gap-3.75 pt-6.75 pb-5.5 text-11 text-[#697060] max-sm:items-start max-sm:text-[.67rem] [&>span]:flex [&>span]:items-center [&>span]:gap-1.25', extra);
export const emptyState = 'empty-state px-6 py-11 text-center';
export const emptyTitle = 'font-medium text-[#657258]';
export const emptyText = 'mx-auto mt-2.25 mb-4.5 max-w-[340px] text-14 leading-[1.8] text-[#69705f]';

// <dialog> modals.
export const modal = (wide: boolean) => cx('m-auto max-h-[90vh] w-[calc(100%-32px)] overflow-y-auto rounded-2xl border border-[#e2e9d8] bg-white p-0 text-[#47613b] shadow-[0_25px_100px_#152c1b33] backdrop:bg-[#1d32254d] backdrop:backdrop-blur-[3px] max-sm:max-h-[92vh]', wide ? 'max-w-[640px]' : 'max-w-[470px]');
export const modalHeader = 'sticky top-0 z-1 flex items-center justify-between border-b border-[#e9efe1] bg-white px-6.25 py-5.25 max-sm:px-5 max-sm:py-4.25';
export const modalBody = 'p-6.25 max-sm:p-5';
export const modalActions = 'mt-5.75 flex items-center justify-between gap-3.75 border-t border-[#edf1e5] pt-5 max-sm:flex-wrap max-sm:gap-2';
export const modalActionGroup = 'ml-auto flex gap-2.5 max-xs:gap-1';
/** Buttons inside the right-hand group of modal actions. */
export const modalBtn = (tone: Tone) => btn(tone, 'none', 'gap-2.25 px-4.5 py-2.75 text-14 min-h-10.75 max-sm:px-3 max-sm:py-2.5 max-sm:text-13');
export const toast = 'fixed bottom-6.25 left-1/2 z-100 flex w-max max-w-[calc(100%-30px)] -translate-x-1/2 items-center gap-3 rounded-[11px] border border-[#477044] bg-[#294e37] px-4 py-3.25 text-[.89rem] text-[#f1f6e8] shadow-[0_10px_35px_#18362225] animate-toast-in max-sm:bottom-4.25 max-sm:px-3.5 max-sm:py-3 max-sm:text-13 [&>svg]:text-[#677352]';
