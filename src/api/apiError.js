export const readApiError = async (response, fallback) => {
    const problem = await response.json().catch(() => null);
    if (problem?.errors) {
        return Object.values(problem.errors).flat().join(" ");
    }
    return problem?.detail || fallback;
};
