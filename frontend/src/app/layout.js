import "./globals.css";

export const metadata = {
  title: "hobby-board",
  description: "hobby-board",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
