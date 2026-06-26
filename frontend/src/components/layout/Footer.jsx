import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-editorial-border dark:border-editorial-border py-6 px-8 text-center text-xs text-editorial-secondary dark:text-editorial-secondary transition-colors">
      © {new Date().getFullYear()} MailZap. Built with Spring Boot & React.
    </footer>
  );
}
