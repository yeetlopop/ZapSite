import re

new_footer = '''    <!-- Footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>
                        <img src="images/hero/robot.png" alt="ZapSite UB" class="footer-logo">
                        ZapSite UB
                    </h3>
                    <p>Profesjonelle nettsider til studentvennlige priser. Vi er en ungdomsbedrift som brenner for å hjelpe småbedrifter med digital tilstedeværelse.</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/profile.php?id=61582088922505" target="_blank" rel="noopener" title="Facebook">
                            <img src="images/social/facebook.png" alt="Facebook">
                        </a>
                        <a href="https://www.instagram.com/ZapSiteUB/" target="_blank" rel="noopener" title="Instagram">
                            <img src="images/social/instagram.png" alt="Instagram">
                        </a>
                        <a href="https://www.tiktok.com/@ZapSiteUB" target="_blank" rel="noopener" title="TikTok">
                            <img src="images/social/tiktok.png" alt="TikTok">
                        </a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>Kontakt Oss</h4>
                    <div class="footer-info-grid">
                        <div class="footer-info-item">
                            <span class="icon">📧</span>
                            <p><a href="mailto:zapsiteub@gmail.com">zapsiteub@gmail.com</a></p>
                        </div>
                        <div class="footer-info-item">
                            <span class="icon">📞</span>
                            <p><a href="tel:+4794979453">+47 949 79 453</a></p>
                        </div>
                        <div class="footer-info-item">
                            <span class="icon">🏫</span>
                            <p>Åssiden VGS</p>
                        </div>
                        <div class="footer-info-item">
                            <span class="icon">📋</span>
                            <p>Org: 936295886</p>
                        </div>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>Veldedighet</h4>
                    <p>❤️ Vi donerer 5% av overskuddet til Røde Kors</p>
                    <h4 style="margin-top: 1.5rem;">Skole</h4>
                    <p>🎓 Ungdomsbedrift ved Åssiden videregående skole</p>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <p>© 2025 ZapSite UB. Alle rettigheter reservert.</p>
                    <button class="back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Tilbake til toppen">
                        ↑
                    </button>
                </div>
            </div>
        </div>
    </footer>'''

files = ['priser.html', 'team.html', 'mentorer.html', 'om-oss.html', 'kontakt.html', 'tutorial.html']

for filename in files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace footer section
    pattern = r'    <!-- Footer -->.*?</footer>'
    content = re.sub(pattern, new_footer, content, flags=re.DOTALL)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {filename}")

print("All footers updated!")