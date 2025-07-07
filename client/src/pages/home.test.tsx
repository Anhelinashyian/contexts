import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
import {fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom';
import Home from './home'

jest.mock("@tanstack/react-query", () => {
    const actual = jest.requireActual("@tanstack/react-query");
    return {
        ...actual,
        useQuery: jest.fn(),
    };
});

jest.mock("../components/task-modal.tsx", () => ({
    TaskModal: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div data-testid="modal">Modal is open</div> : null,
}));

jest.mock("../../../shared/schema.ts", () => ({
    __esModule: true,
    TaskWithContext: {},
    Context: {},
}));


const mockedUseQuery = useQuery as jest.Mock;

const renderHome = () => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <Home />
        </QueryClientProvider>
    );
};

describe("Home", () => {
    beforeEach(() => {
        mockedUseQuery.mockImplementation(({ queryKey }) => {
            if (queryKey[0] === "/api/tasks") {
                return {
                    data: [
                        {
                            id: 1,
                            name: "Test Task",
                            description: "Test description",
                            comments: "Optional comment",
                            contextId: 101,
                        },
                    ],
                    isLoading: false,
                };
            }

            if (queryKey[0] === "/api/contexts") {
                return {
                    data: [
                        {
                            id: 101,
                            name: "Test Context",
                            color: "#3b82f6",
                        },
                    ],
                    isLoading: false,
                };
            }

            return { data: [], isLoading: false };
        });
    });

    it("renders task and context", () => {
        renderHome();
        expect(screen.getByText("Test Task")).toBeInTheDocument();
        expect(screen.getByText("Test Context")).toBeInTheDocument();
    });

    it("opens modal on button click", () => {
        renderHome();
        fireEvent.click(screen.getByText("Add New Task"));
        expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
});
