import { ActionDialog } from '@/Components/ActionDialog';
import { GetPriorityBadge } from '@/Components/GetPriorityBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { PiCheckSquare, PiDotsThreeOutlineFill, PiLinkSimple, PiPlus, PiUser } from 'react-icons/pi';
import { toast } from 'sonner';

export default function Show({ ...props }) {
    console.log('Props dari Inertia:', props); // 👈 Debug log
    const workspace = props.workspace;
    const statuses = props.statuses;
    const cards = props.cards;

    return (
        <>
            <div>
                <img className="h-32 w-full object-cover lg:h-48" src={workspace.cover} alt={workspace.name} />
            </div>
            <div className="px-2 sm:px-4">
                <div className="-mt-12 sm:flex sm:items-center sm:space-x-5">
                    <div className="flex">
                        <img
                            className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                            src={workspace.logo}
                            alt={workspace.name}
                        />
                    </div>
                    <div className="items-center sm:flex sm:min-w-0 sm:flex-1 sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="mt-6 min-w-0 flex-1">
                            <CardTitle className="text-4xl leading-relaxed tracking-tighter">
                                {workspace.name}
                            </CardTitle>
                        </div>
                        <div className="mt-8 flex items-center gap-x-8">
                            <Link
                                href={route('cards.create', [workspace])}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors hover:font-bold hover:text-red-500 hover:no-underline hover:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Create Card
                            </Link>
                            <Link
                                href={route('workspaces.edit', [workspace])}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors hover:font-bold hover:text-red-500 hover:no-underline hover:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Settings
                            </Link>
                        </div>
                    </div>
                </div>
                {/* card */}
                <div className="mt-8 flex w-full flex-col justify-start gap-x-5 gap-y-8 sm:flex-row">
                    {statuses.map((status, index) => (
                        <div className="w-full space-y-4 sm:w-1/4" key={index}>
                            <div className="flex items-center justify-between">
                                <span className="tracking-thigter text-base font-semibold leading-relaxed">
                                    {status.value}
                                </span>
                                <div className="flex items-center gap-x-3">
                                    <Link
                                        href={route('cards.create', {
                                            workspace: workspace,
                                            _query: {
                                                status: status.value,
                                            },
                                        })}
                                    >
                                        <PiPlus className="h-4 w-4 text-foreground transition-colors duration-200 hover:text-red-500" />
                                    </Link>
                                </div>
                            </div>
                            {/* column card container */}
                            <div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
                                {cards
                                    .filter((card) => card.status == status.value)
                                    .map((card, index) => (
                                        <Card
                                            key={index}
                                            className="relative rounded-xl hover:ring-2 hover:ring-inset hover:ring-red-500"
                                        >
                                            <CardHeader>
                                                <div className="flex items-center justify-between gap-x-4">
                                                    <CardTitle className="tracking-thigter line-clamp-2 text-base leading-relaxed">
                                                        <Link
                                                            href={route('cards.show', [workspace, card])}
                                                            className="hover:text-red-500"
                                                        >
                                                            {card.title}
                                                        </Link>
                                                    </CardTitle>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <PiDotsThreeOutlineFill className="size-4" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('cards.edit', [workspace, card])}>
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuGroup>
                                                                <ActionDialog
                                                                    trigger={
                                                                        <DropdownMenuItem
                                                                            onSelect={(e) => e.preventDefault()}
                                                                        >
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    }
                                                                    title="Delete Card"
                                                                    description="Are you sure you want to delete this card?"
                                                                    action={() =>
                                                                        router.delete(
                                                                            route('cards.destroy', [workspace, card]),
                                                                            {
                                                                                preserveScroll: true,
                                                                                preserveState: true,
                                                                                onSuccess: (success) => {
                                                                                    const flash = flashMessage(success);
                                                                                    if (flash)
                                                                                        toast[flash.type](
                                                                                            flash.message,
                                                                                        );
                                                                                },
                                                                            },
                                                                        )
                                                                    }
                                                                />
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div>
                                                    <GetPriorityBadge priority={card.priority} />
                                                </div>
                                                <CardDescription className="tracking-thigter line-clamp-4 leading-relaxed">
                                                    {card.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-col space-y-8">
                                                    {card.has_task && (
                                                        <div>
                                                            <div className="mb-1.5 flex items-center justify-between">
                                                                <p className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                                                    <span className="p-1 font-medium text-red-500">
                                                                        {card.percentage}
                                                                    </span>
                                                                    of 100
                                                                </p>
                                                                <p className="text-sm text-xs leading-relaxed tracking-tighter text-muted-foreground">
                                                                    {card.deadline > 0 ? (
                                                                        <span>{card.deadline} days left</span>
                                                                    ) : card.deadline == 0 ? (
                                                                        <span className="text-yellow-500">
                                                                            Today is deadline
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-red-500">overdue</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-x-4">
                                                                {card.has_task && (
                                                                    <div
                                                                        className="flex items-center gap-x-1"
                                                                        title={`${card.tasks_count} tasks`}
                                                                    >
                                                                        <PiCheckSquare className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="text-sm text-xs leading-relaxed tracking-tighter text-muted-foreground">
                                                                            {card.tasks_count}
                                                                            {/* Tasks */}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {card.members_count > 1 && (
                                                                    <div
                                                                        className="flex items-center gap-x-1"
                                                                        title={`${card.members_count} members`}
                                                                    >
                                                                        <PiUser className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="text-xs leading-relaxed tracking-tighter text-muted-foreground">
                                                                            {card.members_count}
                                                                            {/* Members */}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {card.has_attachment && (
                                                                    <div
                                                                        className="flex items-center gap-x-1"
                                                                        title={`${card.attachments_count} files attached`}
                                                                    >
                                                                        <PiLinkSimple className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="text-xs leading-relaxed tracking-tighter text-muted-foreground">
                                                                            {card.attachments_count}
                                                                            {/* Files */}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <AppLayout children={page} title={page.props.workspace.name} />;
