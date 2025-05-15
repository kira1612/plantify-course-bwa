import AppLayout from '@/Layouts/AppLayout';

export default function Testing() {
    return <div>This is testings</div>;
}
Testing.layout = (page) => <AppLayout children={page} title="Testing" />;
