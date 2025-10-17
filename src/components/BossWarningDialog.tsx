import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface BossWarningDialogProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export const BossWarningDialog = ({ open, onAccept, onCancel }: BossWarningDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="max-w-md border-2 border-warning bg-gradient-to-br from-background to-warning/10 z-[9999]" style={{ position: 'fixed', zIndex: 9999 }}>
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-warning/20 animate-pulse">
              <AlertTriangle className="w-12 h-12 text-warning" />
            </div>
          </div>
          <AlertDialogTitle className="text-2xl text-center font-bold">
            ⚠️ BOSS CHALLENGE - LEVEL 10 ⚠️
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4 text-base">
            <p className="text-foreground font-semibold">
              Warning: This is the ultimate challenge!
            </p>
            <div className="space-y-2 text-left bg-background/50 p-4 rounded-lg">
              <p className="flex items-center gap-2">
                <span className="text-2xl">❌</span>
                <span>
                  If you <span className="font-bold text-destructive">FAIL</span>: Your points will be reduced by{' '}
                  <span className="font-bold text-destructive">HALF (-50%)</span>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span>
                  If you <span className="font-bold text-green-500">WIN</span>: Your points will{' '}
                  <span className="font-bold text-green-500">DOUBLE (+100%)</span>
                </span>
              </p>
            </div>
            <p className="text-lg font-bold text-foreground">Are you ready to take the risk?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel onClick={onCancel} className="flex-1">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:scale-105"
          >
            🎯 Accept Challenge! 🎯
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
