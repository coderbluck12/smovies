import "remixicon/fonts/remixicon.css";

const Footer: React.FC = () => {
  const footerLinks = [
    [
      {
        label: "Condition of Use",
        text: "Condition of Use",
        isIcon: false,
        link: "",
      },
      {
        label: "Privacy & Policy",
        text: "Privacy & Policy",
        isIcon: false,
        link: "",
      },
      {
        label: "Pressroom",
        text: "Pressroom",
        isIcon: false,
        link: "",
      },
    ],
    [{ label: "SMovies © 2025", text: "Benjamin Nkem", isIcon: false, link: "" }],
  ];

  return (
    <footer className="">
      <div className="dark:bg-darkShade py-5 flex justify-center items-center text-gray-800 dark:text-gray-300">
        <div className="space-y-2">
          {footerLinks.map((linksContainer, idx) => (
            <ul key={idx} className="flex items-center space-x-5 text-center justify-center">
              <>
                {linksContainer.map((link, idx) => (
                  <li key={idx} title={link.text} className={link.isIcon ? "text-2xl" : "text-base"}>
                    {link.link ? (
                      <a href={link.link} target="_blank">
                        {link.label}
                      </a>
                    ) : (
                      link.label
                    )}
                  </li>
                ))}
              </>
            </ul>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
