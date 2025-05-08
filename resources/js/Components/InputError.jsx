export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={'mt-2 text-sm text-red-600 tracking-thighter ' + className}>
            {message}
        </p>
    ) : null;
}
