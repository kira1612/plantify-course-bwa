import HeaderForm from '@/Components/HeaderForm';
import AppLayout from '@/Layouts/AppLayout';
import EditWorkspace from './EditWorkspace';
import MemberWorkspace from './MemberWorkspace';

export default function Setting({ ...props }) {
    const page_settings = props.page_settings;
    const workspace = props.workspace;
    const visibilities = props.visibilities;

    return (
        <div className="space-y-10 divide-y divide-dashed divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3">
                <HeaderForm title={page_settings.title} subtitle={page_settings.subtitle} />
                <EditWorkspace page_settings={page_settings} workspace={workspace} visibilities={visibilities} />
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 pt-10 md:grid-cols-3">
                <HeaderForm title="Members" subtitle="Please add members to the card" />
                <MemberWorkspace action={route('workspaces.member_store', [workspace])} />
            </div>
        </div>
    );
}

Setting.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title} />;
