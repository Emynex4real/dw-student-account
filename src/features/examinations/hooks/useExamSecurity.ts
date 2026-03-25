import { useEffect } from 'react';
import { useExamStore } from '../store/examStore';

export const useExamSecurity = (onTabSwitch?: () => void) => {
  const { incrementTabSwitch, setFullScreen, session, currentExam } = useExamStore();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && session) {
        incrementTabSwitch();
        onTabSwitch?.();
      }
    };

    const handleFullScreenChange = () => {
      const isFullScreen = !!document.fullscreenElement;
      setFullScreen(isFullScreen);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [session, incrementTabSwitch, setFullScreen, onTabSwitch]);

  const enterFullScreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setFullScreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setFullScreen(false);
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  return {
    enterFullScreen,
    exitFullScreen,
    isFullScreen: session?.isFullScreen || false,
    tabSwitchCount: session?.tabSwitchCount || 0,
    maxTabSwitches: currentExam?.settings.maxTabSwitches || 3
  };
};
