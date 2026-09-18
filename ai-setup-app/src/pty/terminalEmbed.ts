import pty from 'node-pty';
import xtermHeadless from '@xterm/headless';
import addonSerialize from '@xterm/addon-serialize';

const { Terminal } = xtermHeadless;
const { SerializeAddon } = addonSerialize;

export interface TerminalOptions {
  cols: number;
  rows: number;
  cwd?: string;
  env?: Record<string, string | undefined>;
  onData?: (data: string) => void;
  onExit?: (exitCode: number, signal?: number) => void;
}

export class TerminalEmbed {
  private cols: number;
  private rows: number;
  private ptyProcess: pty.IPty | null = null;
  private term: any;
  private serializer: any;
  private isAlive: boolean = false;
  private lastLines: string[] = [];
  public scrollOffset: number = 0;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.term = new Terminal({
      cols: Math.max(10, cols),
      rows: Math.max(5, rows),
      scrollback: 1000,
      allowProposedApi: true,
    });
    this.serializer = new SerializeAddon();
    this.term.loadAddon(this.serializer);
  }

  public start(command: string, args: string[] = [], options?: Partial<TerminalOptions>): void {
    if (this.isAlive) {
      this.kill();
    }

    const cols = options?.cols || this.cols;
    const rows = options?.rows || this.rows;
    this.cols = cols;
    this.rows = rows;
    this.scrollOffset = 0;

    this.term.resize(Math.max(10, cols), Math.max(5, rows));

    const env = {
      ...process.env,
      TERM: 'xterm-256color',
      COLORTERM: 'truecolor',
      FORCE_COLOR: '3',
      ...(options?.env || {}),
    } as Record<string, string>;

    try {
      this.ptyProcess = pty.spawn(command, args, {
        name: 'xterm-256color',
        cols: Math.max(10, cols),
        rows: Math.max(5, rows),
        cwd: options?.cwd || process.cwd(),
        env,
      });

      this.isAlive = true;

      this.ptyProcess.onData((data: string) => {
        this.term.write(data);
        if (options?.onData) {
          options.onData(data);
        }
      });

      this.ptyProcess.onExit(({ exitCode, signal }) => {
        this.isAlive = false;
        if (options?.onExit) {
          options.onExit(exitCode, signal);
        }
      });
    } catch (err) {
      this.isAlive = false;
      throw err;
    }
  }

  public write(data: string): void {
    if (this.isAlive && this.ptyProcess) {
      // Typing resets scroll to live bottom
      this.scrollOffset = 0;
      this.ptyProcess.write(data);
    }
  }

  public scroll(delta: number): void {
    const maxScroll = this.getMaxScroll();
    this.scrollOffset = Math.max(0, Math.min(maxScroll, this.scrollOffset + delta));
  }

  public scrollToBottom(): void {
    this.scrollOffset = 0;
  }

  public scrollToTop(): void {
    this.scrollOffset = this.getMaxScroll();
  }

  public getMaxScroll(): number {
    try {
      const all = this.serializer.serialize().split(/\r?\n/);
      return Math.max(0, all.length - this.rows);
    } catch {
      return 0;
    }
  }

  public resize(cols: number, rows: number): void {
    const validCols = Math.max(10, cols);
    const validRows = Math.max(5, rows);
    this.cols = validCols;
    this.rows = validRows;
    this.term.resize(validCols, validRows);
    if (this.isAlive && this.ptyProcess) {
      try {
        this.ptyProcess.resize(validCols, validRows);
      } catch {
        // ignore resize error during exit
      }
    }
  }

  public getVisibleLines(): string[] {
    try {
      const all = this.serializer.serialize().split(/\r?\n/);
      const end = Math.max(this.rows, all.length - this.scrollOffset);
      const start = Math.max(0, end - this.rows);
      const result = all.slice(start, end);
      while (result.length < this.rows) {
        result.push('');
      }
      this.lastLines = result;
      return result;
    } catch {
      return this.lastLines;
    }
  }

  public getCursor(): { x: number; y: number } {
    const active = this.term.buffer.active;
    return {
      x: active.cursorX,
      y: active.cursorY,
    };
  }

  public isRunning(): boolean {
    return this.isAlive;
  }

  public kill(signal: string = 'SIGTERM'): void {
    if (this.ptyProcess) {
      try {
        this.ptyProcess.kill(signal);
      } catch {
        // Process might already be dead
      }
      this.ptyProcess = null;
      this.isAlive = false;
    }
  }
}
