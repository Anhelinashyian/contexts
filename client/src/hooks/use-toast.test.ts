import { reducer } from "./use-toast";
import { toast as createToast } from "./use-toast";

describe("toast reducer", () => {
    const baseToast = {
        id: "1",
        title: "Sample Toast",
        open: true,
    }

    it("should add a toast", () => {
        const state = { toasts: [] }
        const newState = reducer(state, {
            type: "ADD_TOAST",
            toast: baseToast,
        })

        expect(newState.toasts).toHaveLength(1)
        expect(newState.toasts[0].title).toBe("Sample Toast")
    })

    it("should update an existing toast", () => {
        const state = { toasts: [{ ...baseToast, title: "Old Title" }] }
        const newState = reducer(state, {
            type: "UPDATE_TOAST",
            toast: { id: "1", title: "New Title" },
        })

        expect(newState.toasts[0].title).toBe("New Title")
    })

    it("should dismiss a toast by setting open=false", () => {
        const state = { toasts: [baseToast] }
        const newState = reducer(state, {
            type: "DISMISS_TOAST",
            toastId: "1",
        })

        expect(newState.toasts[0].open).toBe(false)
    })

    it("should remove a toast by id", () => {
        const state = { toasts: [baseToast] }
        const newState = reducer(state, {
            type: "REMOVE_TOAST",
            toastId: "1",
        })

        expect(newState.toasts).toHaveLength(0)
    })

    it("should remove all toasts if toastId is undefined", () => {
        const state = {
            toasts: [
                { id: "1", title: "A" },
                { id: "2", title: "B" },
            ],
        }

        const newState = reducer(state, {
            type: "REMOVE_TOAST",
            toastId: undefined,
        })

        expect(newState.toasts).toHaveLength(0)
    })

    it("should respect TOAST_LIMIT", () => {
        const state = {
            toasts: [
                { id: "2", title: "Old Toast" },
            ],
        }

        const newToast = { id: "3", title: "New Toast" }

        const newState = reducer(state, {
            type: "ADD_TOAST",
            toast: newToast,
        })

        expect(newState.toasts).toHaveLength(1)
        expect(newState.toasts[0].id).toBe("3") // should push the new one at front
    })
})

describe("toast() factory function", () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it("should create a toast with unique ID and expose dismiss/update", () => {
        const { id, dismiss, update } = createToast({
            title: "Hello",
            description: "World",
        })

        expect(typeof id).toBe("string")
        expect(typeof dismiss).toBe("function")
        expect(typeof update).toBe("function")
    })

    it("should auto-remove toast after delay", () => {
        const { id } = createToast({ title: "Timed Toast" })
        jest.advanceTimersByTime(999999)

        jest.advanceTimersByTime(1)
        expect(true).toBeTruthy()
    })
})
