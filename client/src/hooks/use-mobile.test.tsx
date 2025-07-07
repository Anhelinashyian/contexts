import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './use-mobile'
describe('useIsMobile', () => {
    const originalInnerWidth = global.innerWidth

    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: window.innerWidth < 768,
                media: query,
                onchange: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }),
        })
    })

    afterEach(() => {
        global.innerWidth = originalInnerWidth
        jest.clearAllMocks()
    })

    it('should return true when window width is less than 768px', () => {
        global.innerWidth = 500

        const { result } = renderHook(() => useIsMobile())
        expect(result.current).toBe(true)
    })

    it('should return false when window width is greater than or equal to 768px', () => {
        global.innerWidth = 1024

        const { result } = renderHook(() => useIsMobile())
        expect(result.current).toBe(false)
    })

    it('should update value when screen is resized', () => {
        let listener: ((ev: MediaQueryListEvent) => void) | null = null

        window.matchMedia = jest.fn().mockImplementation((query: string) => {
            const mql = {
                matches: window.innerWidth < 768,
                media: query,
                onchange: null,
                addEventListener: jest.fn((event: string, cb: (ev: any) => void) => {
                    if (event === 'change') listener = cb
                }),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }
            return mql
        })

        global.innerWidth = 1024
        const { result } = renderHook(() => useIsMobile())
        expect(result.current).toBe(false)

        act(() => {
            global.innerWidth = 500
            listener?.({ matches: true } as MediaQueryListEvent)
        })

        expect(result.current).toBe(true)
    })
})