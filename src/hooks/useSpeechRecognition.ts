import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = (onResult: (text: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const onResultRef = useRef(onResult);

    // Update ref when onResult changes to avoid re-triggering the effect
    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Browser Support Check
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false; // Stop after one sentence
            recog.lang = 'ar-SA'; // Arabic Support
            recog.interimResults = false;

            recog.onstart = () => setIsListening(true);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recog.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                // Use the ref to access the latest callback
                if (onResultRef.current) {
                    onResultRef.current(transcript);
                }
                setIsListening(false);
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recog.onerror = (event: any) => {
                console.error("Speech Recognition Error", event.error);
                setIsListening(false);
            };

            recog.onend = () => setIsListening(false);

            recognitionRef.current = recog;
        }
    }, []); // Run only once on mount

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                // If already started, ignore
                console.log("Recognition already started or error", e);
            }
        } else {
            console.warn("Browser does not support Speech Recognition.");
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    return { isListening, startListening, stopListening };
};
