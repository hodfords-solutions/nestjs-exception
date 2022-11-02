export type ValidationErrorExceptionDetail = {
    message: string;
    detail: {
        property?: string;
        [item: string]: string | undefined;
    };
};
