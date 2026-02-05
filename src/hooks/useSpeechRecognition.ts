import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = (onResult: (text: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const onResultRef = useRef(onResult);

    // Update ref when onResult changes to avoid re-triggering the effect
    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Browser Support Check
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false; // Stop after one sentence
            recog.lang = 'ar-SA'; // Arabic Support
            recog.interimResults = false;

            recog.onstart = () => setIsListening(true);

            recog.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                // Use the ref to access the latest callback
                if (onResultRef.current) {
                    onResultRef.current(transcript);
                }
                setIsListening(false);
            };

            recog.onerror = (event: any) => {
                console.error("Speech Recognition Error", event.error);
                setIsListening(false);
            };

            recog.onend = () => setIsListening(false);

            setRecognition(recog);
        }
    }, []); // Run only once on mount

    const startListening = useCallback(() => {
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {
                // If already started, ignore
                console.log("Recognition already started or error", e);
            }
        } else {
            console.warn("Browser does not support Speech Recognition.");
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition]);

    return { isListening, startListening, stopListening };
};
